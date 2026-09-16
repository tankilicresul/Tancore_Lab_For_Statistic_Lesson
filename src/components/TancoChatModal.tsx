import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { formatStudentGreetingName } from '../utils/localization';
import { askTancoAI, ChatMessageHistoryItem } from '../services/tancoAi';
import {
  fetchTancoChatsFromSupabase,
  saveTancoChatMessageToSupabase,
  clearTancoChatsInSupabase,
} from '../lib/supabase';
import { KatexFormula } from './KatexFormula';
import {
  X,
  Send,
  Camera,
  Mic,
  MicOff,
  Trash2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'tanco' | 'student';
  text: string;
  imageUrl?: string;
  timestamp: string;
}

const QUICK_PROMPTS = {
  tr: [
    'Bayes Teoremi formülünü ve mantığını açıklar mısın?',
    'Hipotez testlerinde p-değeri tam olarak ne anlama gelir?',
    'Doğrusal Programlama ve Simplex yöntemi nasıl çalışır?',
    'Markov Zincirleri ve geçiş olasılıkları nedir?',
    'ENGR 200 veya INDR 252 için nasıl bir çalışma stratejisi önerirsin?',
  ],
  en: [
    'Can you explain Bayes Theorem formula and intuition?',
    'What does the p-value mean in hypothesis testing?',
    'How does Linear Programming and the Simplex method work?',
    'What are Markov Chains and transition probabilities?',
    'What study strategy do you recommend for ENGR 200 or INDR 252?',
  ],
};

/**
 * Rich message parser supporting KaTeX ($$...$$ and $...$) and basic Markdown (bold, lists)
 */
const FormattedMessageText: React.FC<{ text: string; isTanco: boolean }> = ({ text, isTanco }) => {
  const blockParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className="space-y-1.5 leading-relaxed break-words">
      {blockParts.map((block, bIdx) => {
        if (block.startsWith('$$') && block.endsWith('$$')) {
          const formula = block.slice(2, -2).trim();
          return (
            <div
              key={bIdx}
              className={`my-2 p-2 rounded-xl text-center overflow-x-auto ${
                isTanco
                  ? 'bg-orange-50/80 border border-orange-200/80 text-orange-950'
                  : 'bg-white/20 text-white'
              }`}
            >
              <KatexFormula formula={formula} displayMode={true} />
            </div>
          );
        }

        const inlineParts = block.split(/(\$[^$\n]+\$)/g);

        return (
          <span key={bIdx}>
            {inlineParts.map((inline, iIdx) => {
              if (inline.startsWith('$') && inline.endsWith('$') && inline.length > 2) {
                const formula = inline.slice(1, -1).trim();
                return (
                  <span
                    key={iIdx}
                    className={`inline-block mx-0.5 px-1.5 py-0.5 rounded text-xs font-semibold ${
                      isTanco
                        ? 'bg-orange-50 text-[#ff7a00] border border-orange-200/60'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <KatexFormula formula={formula} displayMode={false} />
                  </span>
                );
              }

              const boldParts = inline.split(/(\*\*[^*]+\*\*)/g);

              return (
                <span key={iIdx}>
                  {boldParts.map((bChunk, chunkIdx) => {
                    if (bChunk.startsWith('**') && bChunk.endsWith('**')) {
                      return (
                        <strong key={chunkIdx} className="font-bold text-slate-900">
                          {bChunk.slice(2, -2)}
                        </strong>
                      );
                    }
                    return <span key={chunkIdx}>{bChunk}</span>;
                  })}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

export const TancoChatModal: React.FC = () => {
  const {
    language,
    isTancoChatOpen,
    setIsTancoChatOpen,
    userProfile,
  } = useAppStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number>(0);

  const studentName = formatStudentGreetingName(userProfile?.fullName, language === 'tr' ? 'Öğrenci' : 'Student');
  const userIdentifier = userProfile?.schoolEmail || userProfile?.id || 'guest_user';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  const initialGreeting: ChatMessage = {
    id: 'welcome-1',
    sender: 'tanco',
    text:
      language === 'tr'
        ? `Selam ${studentName}! Ben Tanco, senin Endüstri Mühendisliği öğretim asistanınım 🎓\n\nOlasılık (ENGR 200), İstatistik (INDR 252), Yöneylem Araştırması veya optimizasyonla ilgili aklına takılan her şeyi bana sorabilirsin. İstersen fotoğraf yükleyerek soru da sorabilirsin!`
        : `Hi ${studentName}! I'm Tanco, your Industrial Engineering TA 🎓\n\nFeel free to ask me anything about Probability, Applied Statistics, Operations Research, or upload problem photos for instant analysis!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load cloud synchronized chat history from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadCloudHistory() {
      if (userProfile?.schoolEmail || userProfile?.id) {
        const cloudMsgs = await fetchTancoChatsFromSupabase(userIdentifier);
        if (isMounted && cloudMsgs && cloudMsgs.length > 0) {
          setMessages([initialGreeting, ...cloudMsgs]);
        }
      }
    }

    if (isTancoChatOpen) {
      loadCloudHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [isTancoChatOpen, userIdentifier]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isTancoChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isTancoChatOpen, isTyping]);

  // Handle Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'tr' ? 'tr-TR' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert(language === 'tr' ? 'Tarayıcınız sesli girişi desteklemiyor.' : 'Your browser does not support voice input.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'tr' ? 'Lütfen geçerli bir görsel seçin.' : 'Please select a valid image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        base64: reader.result as string,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!isTancoChatOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    const currentImage = selectedImage;

    if ((!query && !currentImage) || isTyping) return;

    // 3-second Anti-Spam Rate Limit Cooldown
    const now = Date.now();
    if (now - lastSentTime < 2500) {
      return;
    }
    setLastSentTime(now);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: query || (language === 'tr' ? '📸 Soru Görseli' : '📸 Problem Image'),
      imageUrl: currentImage?.base64,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSelectedImage(null);
    setIsTyping(true);

    // Save student message to Supabase cloud sync
    if (userProfile?.schoolEmail || userProfile?.id) {
      saveTancoChatMessageToSupabase(userIdentifier, userProfile?.schoolEmail, 'student', query || '[Görsel Soru]');
    }

    try {
      // Build conversation history for the AI
      const history: ChatMessageHistoryItem[] = messages
        .filter((m) => m.id !== 'welcome-1')
        .map((m) => ({
          role: m.sender === 'student' ? 'user' : 'model',
          content: m.text,
        }));

      const reply = await askTancoAI(
        query,
        history,
        language as 'tr' | 'en',
        studentName,
        currentImage?.base64,
        currentImage?.mimeType
      );

      const tancoMsg: ChatMessage = {
        id: `tanco-${Date.now()}`,
        sender: 'tanco',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tancoMsg]);

      // Save Tanco response to Supabase cloud sync
      if (userProfile?.schoolEmail || userProfile?.id) {
        saveTancoChatMessageToSupabase(userIdentifier, userProfile?.schoolEmail, 'tanco', reply);
      }
    } catch (error) {
      console.error('Tanco AI Error:', error);
      const fallbackMsg: ChatMessage = {
        id: `tanco-${Date.now()}`,
        sender: 'tanco',
        text:
          language === 'tr'
            ? 'Üzgünüm, şu an bağlantıda kısa bir kesinti oldu. Lütfen sorunu tekrar sor veya .env dosyandaki API anahtarını kontrol et!'
            : 'Sorry, a connection issue occurred. Please retry your question or check your API key in .env!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([initialGreeting]);
    setSelectedImage(null);
    if (userProfile?.schoolEmail || userProfile?.id) {
      await clearTancoChatsInSupabase(userIdentifier);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      {/* Click outside to close (desktop) */}
      <div
        className="hidden sm:block absolute inset-0 -z-10"
        onClick={() => setIsTancoChatOpen(false)}
      />

      {/* Main Chat Box */}
      <div className="relative w-full sm:w-[460px] h-[92vh] sm:h-[680px] max-h-[95vh] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in">
        {/* Chat Header */}
        <div className="p-4 sm:p-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative shrink-0">
              <TanCoreMascotAvatar
                size="md"
                className="rounded-full shadow-md shadow-[#ff7a00]/30 border-2 border-[#ff7a00]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-2xs animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-none flex items-center gap-1.5">
                  Tanco
                  <Sparkles className="w-3.5 h-3.5 text-[#ff7a00] inline-block animate-pulse" />
                </h3>
                <span className="px-1.5 py-0.5 rounded-full bg-[#ff7a00]/25 text-[#ff7a00] font-mono text-[9.5px] font-black uppercase tracking-wider border border-[#ff7a00]/40">
                  AI TA
                </span>
              </div>
              <p className="text-[10.5px] sm:text-[11.5px] text-slate-300 font-medium truncate mt-0.5">
                {language === 'tr' ? 'Endüstri Mühendisliği Asistanı • Çevrimiçi' : 'Industrial Engineering TA • Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
              title={language === 'tr' ? 'Sohbeti Temizle' : 'Clear Chat'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTancoChatOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={language === 'tr' ? 'Kapat' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isTanco = msg.sender === 'tanco';

            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  isTanco ? 'justify-start' : 'justify-end'
                }`}
              >
                {isTanco && (
                  <div className="shrink-0 mb-1">
                    <TanCoreMascotAvatar size="sm" className="rounded-full shadow-2xs border border-[#ff7a00]/40" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    isTanco
                      ? 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                      : 'bg-[#ff7a00] text-white rounded-br-xs font-medium'
                  }`}
                >
                  {/* Render Image Thumbnail if attached */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/30 shadow-xs max-w-[220px]">
                      <img src={msg.imageUrl} alt="Soru görseli" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  )}

                  <FormattedMessageText text={msg.text} isTanco={isTanco} />
                  <div
                    className={`text-[9px] mt-2 text-right font-mono ${
                      isTanco ? 'text-slate-400' : 'text-white/80'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <TanCoreMascotAvatar size="sm" className="rounded-full shadow-2xs border border-[#ff7a00]/40" />
              <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center space-x-2 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10.5px] text-slate-500 font-medium ml-1">
                  {language === 'tr' ? 'Tanco düşünüyor ve yanıt hazırlıyor...' : 'Tanco is thinking...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        {messages.length <= 2 && !isTyping && (
          <div className="px-3.5 py-2 bg-slate-100/80 border-t border-slate-200/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            {(language === 'tr' ? QUICK_PROMPTS.tr : QUICK_PROMPTS.en).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/90 text-[10.5px] font-medium text-slate-700 hover:text-[#ff7a00] hover:border-[#ff7a00]/50 transition-all shadow-2xs shrink-0 cursor-pointer text-left"
              >
                💬 {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Image Attachment Preview Bar */}
        {selectedImage && (
          <div className="px-3.5 py-2 bg-amber-50/90 border-t border-amber-200/80 flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-300 shrink-0">
                <img src={selectedImage.base64} alt="Attached" className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] text-amber-900 font-medium truncate">
                {language === 'tr' ? 'Soru görseli eklendi (Fotoğraflı analiz)' : 'Problem image attached'}
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-200/50 transition-colors cursor-pointer"
              title={language === 'tr' ? 'Görseli Kaldır' : 'Remove Image'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Footer Area */}
        <div className="p-3 sm:p-3.5 bg-white border-t border-slate-200/90 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Hidden File Input for Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Visual AI Photo Analysis (Camera Button) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shrink-0 relative ${
                selectedImage
                  ? 'bg-[#ff7a00] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title={
                language === 'tr'
                  ? 'Görsel / Soru Fotoğrafı Yükle'
                  : 'Upload Problem Image'
              }
            >
              {selectedImage ? <ImageIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title={
                isListening
                  ? language === 'tr' ? 'Dinleniyor... (Durdurmak için tıkla)' : 'Listening... (Click to stop)'
                  : language === 'tr' ? 'Sesli Soru Sor' : 'Voice Input'
              }
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Main Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? language === 'tr' ? 'Dinleniyor... Konuşabilirsiniz' : 'Listening...'
                  : selectedImage
                  ? language === 'tr' ? 'Görselle ilgili soru sor veya doğrudan gönder...' : 'Ask about the image or send...'
                  : language === 'tr'
                  ? "Tanco'ya bir soru veya konu sor..."
                  : "Ask Tanco a question or concept..."
              }
              className="flex-1 px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/40 focus:bg-white transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!inputMessage.trim() && !selectedImage) || isTyping}
              className={`p-2.5 sm:p-3 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs ${
                (inputMessage.trim() || selectedImage) && !isTyping
                  ? 'bg-[#ff7a00] hover:bg-[#e66e00] text-white shadow-[#ff7a00]/30 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title={language === 'tr' ? 'Gönder' : 'Send'}
            >
              <Send className="w-4 h-4 stroke-[2.25]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
