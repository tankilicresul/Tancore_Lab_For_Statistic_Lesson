/**
 * Vercel Serverless Function: /api/lemon-webhook
 * Handles Lemon Squeezy Webhooks to activate/deactivate TanCoreLab Plus subscriptions.
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jjbofttymfqjivzzhaly.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYm9mdHR5bWZxaml2enpoYWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDExODQsImV4cCI6MjEwMDQxNzE4NH0.PjLoA5LDDUtewmFdaRNVPUImSjhM6kLiViHdmVJgk84';
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export const config = {
  api: {
    bodyParser: false, // Required for raw body HMAC signature verification
  },
};

// Helper to buffer raw body for HMAC verification
async function getRawBody(req: any): Promise<string> {
  const chunks: any[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let rawBody = '';
    let payload: any = null;

    if (typeof req.body === 'object' && req.body !== null && !Buffer.isBuffer(req.body)) {
      payload = req.body;
      rawBody = JSON.stringify(req.body);
    } else {
      rawBody = await getRawBody(req);
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    // HMAC Signature verification if secret is configured
    const signature = (req.headers['x-signature'] as string) || '';
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        console.warn('[LemonWebhook] Invalid signature received.');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const eventName = payload?.meta?.event_name || req.headers['x-event-name'];
    const customData = payload?.meta?.custom_data || {};
    const dataAttributes = payload?.data?.attributes || {};

    console.log(`[LemonWebhook] Received event: ${eventName}`, {
      userEmail: customData.user_email || dataAttributes.user_email,
      orderId: payload?.data?.id,
    });

    // Extract student email from custom_data or attributes
    const studentEmail = (
      customData.user_email ||
      customData.email ||
      dataAttributes.user_email ||
      dataAttributes.customer_email ||
      ''
    ).trim().toLowerCase();

    if (!studentEmail) {
      console.warn('[LemonWebhook] No student email found in webhook payload.');
      return res.status(200).json({ received: true, note: 'No email found in payload' });
    }

    if (!supabase) {
      console.error('[LemonWebhook] Supabase client not initialized.');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const status = dataAttributes.status || 'active';
    const renewsAt = dataAttributes.renews_at || dataAttributes.ends_at || null;

    // Check event types
    if (
      eventName === 'subscription_created' ||
      eventName === 'subscription_resumed' ||
      eventName === 'subscription_unpaused' ||
      eventName === 'order_created'
    ) {
      // Activate TanCoreLab Plus
      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          subscription_status: status,
          subscription_renews_at: renewsAt,
          updated_at: new Date().toISOString(),
        })
        .eq('email', studentEmail);

      if (error) {
        console.error(`[LemonWebhook] Error updating profile for ${studentEmail}:`, error);
      } else {
        console.log(`[LemonWebhook] Successfully activated PLUS for ${studentEmail}`);
      }
    } else if (
      eventName === 'subscription_cancelled' ||
      eventName === 'subscription_expired'
    ) {
      // If expired or hard cancelled
      const isExpired = eventName === 'subscription_expired' || status === 'expired';
      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: !isExpired, // If just cancelled but not yet expired, may keep access until renews_at
          subscription_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('email', studentEmail);

      if (error) {
        console.error(`[LemonWebhook] Error deactivating subscription for ${studentEmail}:`, error);
      } else {
        console.log(`[LemonWebhook] Updated status to ${status} for ${studentEmail}`);
      }
    }

    return res.status(200).json({ success: true, event: eventName, email: studentEmail });
  } catch (err: any) {
    console.error('[LemonWebhook] Fatal handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal webhook error' });
  }
}
