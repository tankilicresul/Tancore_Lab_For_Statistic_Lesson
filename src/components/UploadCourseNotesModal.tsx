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
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  File,
} from 'lucide-react';

interface UploadCourseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  courseTitle: string;
}

const MAX_FILES = 5;

export const UploadCourseNotesModal: React.FC<UploadCourseNotesModalProps> = ({
  isOpen,
  onClose,
  courseCode,
  courseTitle,
}) => {
  const { language, userProfile, addXp } = useAppStore();
  const isEn = language === 'en';

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadedRecords, setUploadedRecords] = useState<UploadedCourseNoteRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const addFilesToSelection = (incomingFiles: FileList | File[]) => {
    const validFiles: File[] = [];
    let sizeExceeded = false;

    Array.from(incomingFiles).forEach((f) => {
      if (f.size > 50 * 1024 * 1024) {
        sizeExceeded = true;
      } else {
        // Prevent exact duplicates in the current batch
        const exists = selectedFiles.some(
          (sf) => sf.name === f.name && sf.size === f.size
        );
        if (!exists) {
          validFiles.push(f);
        }
      }
    });

    if (sizeExceeded) {
      setErrorMessage(
        isEn
          ? 'Some files exceeded the 50MB limit and were skipped.'
          : '50MB limitini aşan dosyalar listeye eklenmedi.'
      );
    } else {
      setErrorMessage(null);
    }

    setSelectedFiles((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_FILES) {
        setErrorMessage(
          isEn
            ? `You can select a maximum of ${MAX_FILES} files at once. First ${MAX_FILES} were kept.`
            : `Tek seferde en fazla ${MAX_FILES} dosya seçebilirsiniz. İlk ${MAX_FILES} dosya tutuldu.`
        );
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToSelection(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToSelection(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFileAtIndex = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setErrorMessage(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMessage(
        isEn ? 'Please select at least one file.' : 'Lütfen en az bir dosya seçin.'
      );
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const uploaderEmail = userProfile?.schoolEmail || 'ogrenci@universite.edu.tr';
    const uploaderName = userProfile?.fullName || (isEn ? 'Student' : 'Öğrenci');

    const successfulUploads: UploadedCourseNoteRecord[] = [];
    let hasError = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgressText(
        isEn
          ? `Uploading (${i + 1}/${selectedFiles.length}): ${file.name}...`
          : `Yükleniyor (${i + 1}/${selectedFiles.length}): ${file.name}...`
      );

      const res = await uploadCourseNoteDocument(
        file,
        courseCode,
        courseTitle,
        uploaderEmail,
        uploaderName,
        description
      );

      if (res.success && res.record) {
        successfulUploads.push(res.record);
      } else {
        hasError = true;
      }
    }

    setIsUploading(false);
    setUploadProgressText('');

    if (successfulUploads.length > 0) {
      setUploadedRecords(successfulUploads);
      setUploadSuccess(true);
      // Give XP proportional to uploaded files (50 XP per file)
      const earnedXp = successfulUploads.length * 50;
      if (addXp) {
        addXp(earnedXp);
      }
    } else if (hasError) {
      setErrorMessage(
        isEn
          ? 'Upload failed. Please check your network and try again.'
          : 'Yükleme başarısız oldu. Lütfen bağlantınızı kontrol edip tekrar deneyin.'
      );
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setDescription('');
    setUploadSuccess(false);
    setUploadedRecords([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalSizeMb = (
    selectedFiles.reduce((acc, f) => acc + f.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

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
                <div className="inline-flex items-center space-x-1 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2">
                  <span>+{uploadedRecords.length * 50} XP KAZANDIN! 🎉</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {isEn
                    ? `${uploadedRecords.length} Files Successfully Uploaded!`
                    : `${uploadedRecords.length} Ders Notu Başarıyla Yüklendi! 🚀`}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                  {isEn
                    ? `Your notes for ${courseCode} have been archived in our TanCoreLab engineering backlog. We will use them to build comprehensive lessons & AI simulators soon!`
                    : `${courseCode} için yüklediğin ${uploadedRecords.length} adet ders materyali başarıyla TanCoreLab mühendislik havuzuna aktarıldı. Notların Gemini AI modellerimizle analiz edilip bu dersin müfredatı oluşturulacak!`}
                </p>
              </div>

              {/* Uploaded File List Summary */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left max-h-36 overflow-y-auto space-y-1.5">
                {uploadedRecords.map((rec, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold truncate flex-1">{rec.fileName}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {(rec.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Upload More Notes' : 'Daha Fazla Not Yükle'}</span>
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
                    ? `Upload up to ${MAX_FILES} lecture slides, syllabus PDFs, exam questions or handwritten notes to help us fast-track this module!`
                    : `Hocanızın ders slaytlarını, vize/final çıkmış sorularını veya PDF notlarını (tek seferde en fazla ${MAX_FILES} dosya) yükleyerek bu modülün açılmasına katkı sağlayın!`}
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
                onClick={() => {
                  if (selectedFiles.length < MAX_FILES) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`relative p-5 sm:p-6 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragging
                    ? 'border-[#ff7a00] bg-orange-50/60 scale-[1.01]'
                    : selectedFiles.length > 0
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-300 hover:border-[#ff7a00] bg-slate-50/50 hover:bg-orange-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.txt"
                  className="hidden"
                />

                <div className="space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-[#ff7a00] flex items-center justify-center mx-auto shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-800 block">
                      {isEn
                        ? `Drag & drop up to ${MAX_FILES} files here, or browse`
                        : `Dosyalarını buraya sürükle veya seç (En fazla ${MAX_FILES} adet)`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      PDF, PPTX, DOCX, ZIP, Resim veya TXT (Dosya başı maks. 50 MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Files List Cards (1 to 5 files) */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-700">
                      {isEn ? 'Selected Files' : 'Seçilen Dosyalar'} ({selectedFiles.length} / {MAX_FILES})
                    </span>
                    <span className="font-mono text-slate-500 font-bold">Toplam: {totalSizeMb} MB</span>
                  </div>

                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#ff7a00] flex items-center justify-center shrink-0">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 truncate block">
                              {file.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFileAtIndex(idx);
                          }}
                          className="w-7 h-7 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title={isEn ? 'Remove file' : 'Dosyayı kaldır'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedFiles.length < MAX_FILES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 rounded-xl border border-dashed border-[#ff7a00]/60 bg-orange-50/40 hover:bg-orange-50 text-[#ff7a00] font-extrabold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Add Another File' : 'Farklı Bir Dosya Daha Ekle'}</span>
                    </button>
                  )}
                </div>
              )}

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

              {/* Submit Button with Dynamic Reward Badge */}
              <button
                type="submit"
                disabled={isUploading || selectedFiles.length === 0}
                className={`w-full py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md ${
                  isUploading || selectedFiles.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#ff7a00] to-amber-500 hover:from-[#e66e00] hover:to-amber-600 shadow-[#ff7a00]/25 active:scale-98 cursor-pointer'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgressText || (isEn ? 'Uploading...' : 'Yükleniyor...')}</span>
                  </>
                ) : (
                  <span>
                    {selectedFiles.length > 0
                      ? isEn
                        ? `Submit ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''} (+${selectedFiles.length * 50} XP)`
                        : `${selectedFiles.length} Dosyayı Yükle (+${selectedFiles.length * 50} XP)`
                      : isEn
                      ? 'Select Files to Upload'
                      : 'Yüklenecek Dosyaları Seçin'}
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

