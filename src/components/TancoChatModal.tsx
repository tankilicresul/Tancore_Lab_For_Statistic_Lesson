import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import { formatStudentGreetingName, getLocalized } from '../utils/localization';
import { getLessonById, getCaseExamById } from '../data/modules';
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
  BookOpen,
  HelpCircle,
  Radio,
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
    currentView,
    selectedLessonId,
    selectedCaseId,
    selectedTrack,
    customActiveModuleName,
  } = useAppStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number>(0);

  const studentName = formatStudentGreetingName(userProfile?.fullName, language === 'tr' ? 'Öğrenci' : 'Student');
  const userIdentifier = userProfile?.schoolEmail || userProfile?.id || 'guest_user';

  // Live Screen Context Detection
  const lessonObj = selectedLessonId ? getLessonById(selectedLessonId) : undefined;
  const caseObj = selectedCaseId ? getCaseExamById(selectedCaseId) : undefined;

  let currentStudyContext: any = null;
  if (currentView === 'lesson' && lessonObj) {
    currentStudyContext = {
      type: 'lesson',
      moduleTitle: getLocalized(lessonObj.module.title, language),
      moduleId: lessonObj.module.id,
      lessonTitle: getLocalized(lessonObj.lesson.title, language),
      lessonId: lessonObj.lesson.id,
      difficulty: lessonObj.lesson.difficulty,
      conceptCard: getLocalized(lessonObj.lesson.conceptCard, language),
      companyExample: getLocalized(lessonObj.lesson.companyExample, language),
      questions: lessonObj.lesson.questions?.map((q) => ({
        prompt: getLocalized(q.prompt, language),
        options: q.options?.map((opt) => getLocalized(opt, language)),
        correctAnswer: q.correctAnswer,
        explanation: getLocalized(q.explanation, language),
      })),
      vocabTerms: lessonObj.lesson.vocabTerms?.map(
        (v) => `${v.term_en}: ${language === 'tr' ? v.explanation_tr : v.explanation_en}`
      ),
    };
  } else if (currentView === 'caseExam' && caseObj) {
    currentStudyContext = {
      type: 'caseExam',
      moduleTitle: getLocalized(caseObj.module.title, language),
      moduleId: caseObj.module.id,
      caseTitle: getLocalized(caseObj.caseExam.title, language),
      caseId: caseObj.caseExam.id,
      businessQuestion: getLocalized(caseObj.caseExam.businessQuestion, language),
      guidedSteps: caseObj.caseExam.guidedSteps?.map((s) => getLocalized(s, language)),
      datasetColumns: caseObj.caseExam.dataset?.columns,
      datasetRows: caseObj.caseExam.dataset?.rows?.slice(0, 5),
      solutionQuestions: caseObj.caseExam.solutionQuestions?.map((q) => ({
        prompt: getLocalized(q.prompt, language),
        options: q.options?.map((opt) => getLocalized(opt, language)),
        correctAnswer: q.correctAnswer,
        explanation: getLocalized(q.explanation, language),
      })),
      expectedApproach: getLocalized(caseObj.caseExam.expectedApproach, language),
    };
  } else if (currentView === 'course') {
    currentStudyContext = {
      type: 'course',
      track: selectedTrack,
      activeTrackTitle:
        selectedTrack === 'probability'
          ? language === 'tr'
            ? 'Olasılık ve Rastgele Değişkenler'
            : 'Probability & Random Variables'
          : language === 'tr'
          ? 'Uygulamalı İstatistik'
          : 'Applied Statistics',
    };
  } else if (currentView === 'placementTest') {
    currentStudyContext = {
      type: 'placementTest',
      title: language === 'tr' ? 'Seviye Belirleme Sınavı' : 'Placement Test',
    };
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  const initialGreeting: ChatMessage = {
    id: 'welcome-1',
    sender: 'tanco',
    text:
      language === 'tr'
        ? currentStudyContext?.type === 'lesson'
          ? `Selam ${studentName}! 🎓 Şu anda **${currentStudyContext.lessonTitle}** konusunu inceliyorsun. Ekrandaki konu anlatımı, formüller, şirket örneği veya mini test sorusuyla ilgili takıldığın her şeyi bana sorabilirsin!`
          : currentStudyContext?.type === 'caseExam'
          ? `Selam ${studentName}! 🎓 Şu anda **${currentStudyContext.caseTitle}** vaka sınavındasın. Vaka problemi, veri seti veya çözüm adımlarında takıldığın noktaları birlikte adım adım çözebiliriz!`
          : `Selam ${studentName}! Ben Tanco, senin Endüstri Mühendisliği öğretim asistanınım 🎓\n\nOlasılık (ENGR 200), İstatistik (INDR 252), Yöneylem Araştırması veya optimizasyonla ilgili aklına takılan her şeyi bana sorabilirsin. İstersen fotoğraf yükleyerek soru da sorabilirsin!`
        : currentStudyContext?.type === 'lesson'
        ? `Hi ${studentName}! 🎓 You are currently studying **${currentStudyContext.lessonTitle}**. Ask me anything about the concept, formulas, company case, or mini test questions on screen!`
        : `Hi ${studentName}! I'm Tanco, your Industrial Engineering TA 🎓\n\nFeel free to ask me anything about Probability, Applied Statistics, Operations Research, or upload problem photos!`,
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

  const isListeningRef = useRef(false);
  const baseTextBeforeListeningRef = useRef('');

  // Handle Continuous Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'tr' ? 'tr-TR' : 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const base = baseTextBeforeListeningRef.current ? `${baseTextBeforeListeningRef.current} ` : '';
        const fullText = (base + finalTranscript + interimTranscript).trim();
        setInputMessage(fullText);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
      };

      recognition.onend = () => {
        // Keep listening continuous unless user explicitly pressed the stop button
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already active or starting
          }
        } else {
          setIsListening(false);
        }
      };

      speechRecognitionRef.current = recognition;
    }

    return () => {
      if (speechRecognitionRef.current) {
        isListeningRef.current = false;
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [language]);

  // Stop listening when chat modal closes
  useEffect(() => {
    if (!isTancoChatOpen && isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      try {
        speechRecognitionRef.current?.stop();
      } catch (e) {}
    }
  }, [isTancoChatOpen]);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert(language === 'tr' ? 'Tarayıcınız sesli girişi desteklemiyor.' : 'Your browser does not support voice input.');
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    } else {
      try {
        baseTextBeforeListeningRef.current = inputMessage.trim();
        isListeningRef.current = true;
        setIsListening(true);
        speechRecognitionRef.current.start();
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

    // Stop voice listening when sending message
    if (isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      try {
        speechRecognitionRef.current?.stop();
      } catch (e) {}
    }

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
        currentImage?.mimeType,
        currentStudyContext
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
      <div className="relative w-full sm:w-[480px] h-[92vh] sm:h-[690px] max-h-[95vh] bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in">
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

        {/* Live Study Screen Indicator Bar */}
        {currentStudyContext && (
          <div className="px-3.5 py-2 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-b border-[#ff7a00]/20 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex items-center space-x-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-ping" />
                <Radio className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
              </div>
              <span className="font-extrabold text-slate-800 text-[11px] truncate">
                {currentStudyContext.type === 'lesson' && `${currentStudyContext.moduleTitle} › ${currentStudyContext.lessonTitle}`}
                {currentStudyContext.type === 'caseExam' && `${currentStudyContext.moduleTitle} › ${currentStudyContext.caseTitle}`}
                {currentStudyContext.type === 'course' && `${currentStudyContext.activeTrackTitle}`}
                {currentStudyContext.type === 'placementTest' && (language === 'tr' ? 'Seviye Belirleme Sınavı' : 'Placement Test')}
              </span>
            </div>
            <span className="text-[9.5px] font-black uppercase text-[#ff7a00] bg-white px-2 py-0.5 rounded-full border border-[#ff7a00]/30 shrink-0 shadow-2xs">
              {language === 'tr' ? 'Canlı Ekran Bağlı' : 'Live Screen'}
            </span>
          </div>
        )}

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
            <div className="flex items-end space-x-2 justify-start animate-fade-in">
              <div className="shrink-0 mb-1">
                <TanCoreMascotAvatar size="sm" className="rounded-full shadow-2xs border border-[#ff7a00]/40" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-xs shadow-2xs flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview Banner if an image is selected */}
        {selectedImage && (
          <div className="p-2.5 bg-amber-50 border-t border-amber-200 flex items-center justify-between shrink-0 animate-fade-in">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={selectedImage.base64}
                alt="Seçilen görsel"
                className="w-10 h-10 object-cover rounded-lg border border-amber-300 shadow-2xs shrink-0"
              />
              <span className="text-xs font-bold text-amber-900 truncate">
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
          {/* Quick Context Question Suggestions */}
          {currentStudyContext && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
              {currentStudyContext.type === 'lesson' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Bu derste ekranda anlatılan temel mantığı ve formülleri özetler misin?' : 'Can you summarize the core logic and formulas of this lesson?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    💡 {language === 'tr' ? 'Konuyu Özetle' : 'Summarize'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Buradaki şirket vaka örneğinde ne anlatılmak isteniyor?' : 'Can you explain the company case example?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    🏢 {language === 'tr' ? 'Şirket Örneğini Açıkla' : 'Explain Case'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Bu konudaki formülün mantığını ve nereden geldiğini açıklar mısın?' : 'Can you explain how this formula works?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    📐 {language === 'tr' ? 'Formül Mantığı' : 'Formula Logic'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Bu dersteki mini kavram sorusunu nasıl çözmeliyim, ipucu verir misin?' : 'How should I solve the mini question on screen?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    ❓ {language === 'tr' ? 'Soru İpucu' : 'Question Hint'}
                  </button>
                </>
              )}
              {currentStudyContext.type === 'caseExam' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Bu vaka sınavındaki problem tanımını ve yaklaşımı adım adım anlatır mısın?' : 'Can you explain the case problem definition and approach?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    🎯 {language === 'tr' ? 'Vaka Amacı' : 'Case Goal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Vaka veri setini nasıl yorumlayıp analiz etmeliyim?' : 'How should I analyze this case dataset?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    📊 {language === 'tr' ? 'Veri Setini Yorumla' : 'Analyze Dataset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(language === 'tr' ? 'Bu vaka sınavındaki rehberli çözüm adımlarını bana açıklar mısın?' : 'Can you guide me through the case solution steps?')}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#ff7a00]/15 hover:text-[#ff7a00] text-slate-700 font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    🧭 {language === 'tr' ? 'Rehberli Çözüm' : 'Guided Solution'}
                  </button>
                </>
              )}
            </div>
          )}

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
                  ? "Tanco'ya bu konu veya soru hakkında sor..."
                  : "Ask Tanco about this topic or question..."
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
