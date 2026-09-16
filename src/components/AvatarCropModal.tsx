import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Loader2 } from 'lucide-react';

interface AvatarCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => Promise<void>;
  onClose: () => void;
  language?: 'tr' | 'en';
}

const OUTPUT_SIZE = 512; // Size of exported square avatar

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  imageSrc,
  onCropComplete,
  onClose,
  language = 'tr',
}) => {
  const [viewportSize, setViewportSize] = useState(240);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgNatural, setImgNatural] = useState<{ width: number; height: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic responsive viewport size calculation
  useEffect(() => {
    const updateSize = () => {
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 360;
      // Allow modal padding (approx 64px-72px total margin)
      const available = Math.min(260, Math.max(180, screenW - 72));
      setViewportSize(available);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute base cover scale
  const baseScale = imgNatural
    ? Math.max(viewportSize / imgNatural.width, viewportSize / imgNatural.height)
    : 1;

  const currentScale = baseScale * zoom;
  const renderedWidth = imgNatural ? imgNatural.width * currentScale : viewportSize;
  const renderedHeight = imgNatural ? imgNatural.height * currentScale : viewportSize;

  // Clamp offset so image always covers the viewport
  const clampOffset = useCallback(
    (x: number, y: number, rWidth: number, rHeight: number, vpSize: number) => {
      const minX = vpSize - rWidth;
      const maxX = 0;
      const minY = vpSize - rHeight;
      const maxY = 0;

      return {
        x: Math.min(maxX, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y)),
      };
    },
    []
  );

  // Initialize offset to center image once loaded
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgNatural({ width: naturalWidth, height: naturalHeight });

    const bScale = Math.max(viewportSize / naturalWidth, viewportSize / naturalHeight);
    const initW = naturalWidth * bScale;
    const initH = naturalHeight * bScale;

    setOffset({
      x: (viewportSize - initW) / 2,
      y: (viewportSize - initH) / 2,
    });
    setZoom(1);
  };

  // Zoom change handler (re-clamp offset on zoom)
  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(1, Math.min(3.5, newZoom));
    setZoom(clampedZoom);

    if (imgNatural) {
      const newScale = baseScale * clampedZoom;
      const newW = imgNatural.width * newScale;
      const newH = imgNatural.height * newScale;
      setOffset((prev) => clampOffset(prev.x, prev.y, newW, newH, viewportSize));
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset(clampOffset(newX, newY, renderedWidth, renderedHeight, viewportSize));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setOffset(clampOffset(newX, newY, renderedWidth, renderedHeight, viewportSize));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Reset to original center
  const handleReset = () => {
    if (!imgNatural) return;
    const initW = imgNatural.width * baseScale;
    const initH = imgNatural.height * baseScale;
    setZoom(1);
    setOffset({
      x: (viewportSize - initW) / 2,
      y: (viewportSize - initH) / 2,
    });
  };

  // Export cropped canvas
  const handleApplyCrop = async () => {
    if (!imgNatural || !imgRef.current) return;
    setIsSaving(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // Calculate slice of natural image
      const scaleRatio = 1 / currentScale;
      const sx = Math.max(0, -offset.x * scaleRatio);
      const sy = Math.max(0, -offset.y * scaleRatio);
      const sWidth = Math.min(imgNatural.width - sx, viewportSize * scaleRatio);
      const sHeight = Math.min(imgNatural.height - sy, viewportSize * scaleRatio);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imgRef.current, sx, sy, sWidth, sHeight, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsSaving(false);
            return;
          }
          const croppedFile = new File([blob], `avatar_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          await onCropComplete(croppedFile);
          setIsSaving(false);
          onClose();
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Crop export failed:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-[340px] sm:max-w-sm max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              {language === 'tr' ? 'Profil Fotoğrafını Düzenle' : 'Edit Profile Photo'}
            </h3>
            <p className="text-[10.5px] sm:text-[11px] text-slate-400">
              {language === 'tr' ? 'Kaydırarak ve yakınlaştırarak oturtun' : 'Pan & zoom to fit the frame'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Crop Viewport Container */}
        <div className="p-3.5 sm:p-5 flex flex-col items-center select-none overflow-hidden flex-1">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl border-2 border-[#ff7a00] shadow-xl bg-slate-950 cursor-grab active:cursor-grabbing touch-none shrink-0"
            style={{ width: viewportSize, height: viewportSize }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop Target"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              draggable={false}
              className="absolute max-w-none pointer-events-none transition-none"
              style={{
                width: renderedWidth,
                height: renderedHeight,
                left: offset.x,
                top: offset.y,
              }}
            />

            {/* Subtle Overlay Guide */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/20">
              <div className="w-full h-full border border-dashed border-white/20 rounded-2xl" />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="w-full mt-4 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-bold px-1">
              <span>{language === 'tr' ? 'Yakınlaştırma' : 'Zoom'}</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={() => handleZoomChange(zoom - 0.2)}
                disabled={zoom <= 1}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="1"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="flex-1 accent-[#ff7a00] h-1.5 bg-slate-800 rounded-lg cursor-pointer min-w-0"
              />

              <button
                type="button"
                onClick={() => handleZoomChange(zoom + 0.2)}
                disabled={zoom >= 3.5}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                title={language === 'tr' ? 'Sıfırla' : 'Reset'}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end space-x-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {language === 'tr' ? 'Vazgeç' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isSaving || !imgNatural}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{language === 'tr' ? 'Kırp ve Kaydet' : 'Crop & Save'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
