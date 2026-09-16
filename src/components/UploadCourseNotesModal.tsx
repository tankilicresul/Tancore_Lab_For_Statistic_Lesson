import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { uploadCourseNoteDocument, UploadedCourseNoteRecord } from '../lib/supabase';
import { TanCoreMascotAvatar } from './TanCoreMascotAvatar';
import {
  X,
  UploadCloud,
  FileText,
  FileCode,
  FileCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface UploadCourseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseTitle: string;
}

export const UploadCourseNotesModal: React.FC<UploadCourseNotesModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseTitle,
}) => {
  const { language, userProfile, addXp } = useAppStore();
  const isEn = language === 'en';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(isEn ? 'File size must be under 50MB.' : 'Dosya boyutu en fazla 50MB olabilir.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(isEn ? 'File size must be under 50MB.' : 'Dosya boyutu en fazla 50MB olabilir.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage(isEn ? 'Please select a file to upload.' : 'Lütfen yüklenecek bir dosya seçin.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const uploaderEmail = userProfile?.schoolEmail || 'ogrenci@universite.edu.tr';
    const uploaderName = userProfile?.fullName || (isEn ? 'Student' : 'Öğrenci');

    const res = await uploadCourseNoteDocument(
      selectedFile,
      courseCode,
      courseTitle,
      uploaderEmail,
      uploaderName,
      description
    );

    setIsUploading(false);

    if (res.success) {
      setUploadSuccess(true);
      if (addXp) {
        addXp(50);
      }
    } else {
      setErrorMessage(res.error || (isEn ? 'Upload failed. Please try again.' : 'Yükleme başarısız oldu. Lütfen tekrar deneyin.'));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setDescription('');
    setUploadSuccess(false);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500/10 via-[#ff7a00]/10 to-orange-500/10 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-amber-500 text-white flex items-center justify-center shadow-md shadow-[#ff7a00]/25 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7a00] font-mono">
                {courseCode}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {isEn ? 'Upload Notes & Help Build Module' : 'Ders Notlarını Yükle, Modülü Hızlandır'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {uploadSuccess ? (
            /* Success State */
            <div className="py-6 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff7a00]" />
                  <span>+50 XP KAZANDIN! 🎉</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {isEn ? 'Thank You for Contributing!' : 'Katkın İçin Teşekkür Ederiz! 🚀'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                  {isEn
                    ? `Your notes for ${courseCode} have been added to the TanCoreLab engineering backlog. We will use them to build comprehensive lessons & AI simulators soon!`
                    : `${courseCode} için yüklediğin ders materyalleri başarıyla TanCoreLab mühendislik havuzuna aktarıldı. Notların Gemini AI modellerimizle analiz edilip bu dersin müfredatı oluşturulacak!`}
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Upload Another Note' : 'Başka Not Yükle'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-extrabold text-xs transition-colors shadow-md shadow-[#ff7a00]/25 cursor-pointer"
                >
                  {isEn ? 'Done' : 'Tamamla'}
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form State */
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Context Alert Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-3">
                <div className="shrink-0 mt-0.5">
                  <TanCoreMascotAvatar size="sm" />
                </div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-extrabold text-amber-950 block mb-0.5">
                    {courseCode} – {courseTitle}
                  </span>
                  {isEn
                    ? 'Upload lecture slides, syllabus PDFs, exam questions or handwritten notes to help us open this module faster!'
                    : 'Hocanızın ders slaytlarını, vize/final çıkmış sorularını, formül kağıtlarını veya PDF notlarını yükleyerek bu modülün açılmasına doğrudan katkı sağla!'}
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragging
                    ? 'border-[#ff7a00] bg-orange-50/60 scale-[1.01]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-[#ff7a00] bg-slate-50/50 hover:bg-orange-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.txt"
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-900 block truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <span className="inline-block text-[11px] font-extrabold text-[#ff7a00] underline">
                      {isEn ? 'Click to choose another file' : 'Farklı bir dosya seçmek için tıkla'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#ff7a00] flex items-center justify-center mx-auto shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-slate-800 block">
                        {isEn ? 'Drag and drop your file here, or browse' : 'Dosyanı buraya sürükle veya dosya seç'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                        PDF, PPTX, DOCX, ZIP, Resim veya TXT (Maks. 50 MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Description / Comments */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  {isEn ? 'Notes / Topics Covered (Optional):' : 'Hangi Konular / Slaytlar Var? (İsteğe Bağlı):'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isEn
                      ? 'e.g. Week 1-4 slides, Midterm prep questions, Simplex algorithm formulas...'
                      : 'Örn: 1-4. Hafta slaytları, Vize çıkmış soruları, Simplex formül kağıdı...'
                  }
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 resize-none transition-all"
                />
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button with Reward Badge */}
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className={`w-full py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md ${
                  isUploading || !selectedFile
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#ff7a00] to-amber-500 hover:from-[#e66e00] hover:to-amber-600 shadow-[#ff7a00]/25 active:scale-98 cursor-pointer'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isEn ? 'Uploading...' : 'Yükleniyor...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>
                      {isEn ? 'Submit Notes (+50 XP)' : 'Ders Notlarını Yükle (+50 XP)'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
