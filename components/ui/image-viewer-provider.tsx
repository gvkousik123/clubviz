'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ImageViewerContextType {
  openImage: (src: string, alt?: string) => void;
  closeImage: () => void;
}

const ImageViewerContext = createContext<ImageViewerContextType>({
  openImage: () => {},
  closeImage: () => {},
});

export const useImageViewer = () => useContext(ImageViewerContext);

// ---------------------------------------------------------------------------
// Provider + Viewer overlay
// ---------------------------------------------------------------------------

/**
 * Wrap the app with this provider (in layout.tsx).
 *
 * Features:
 *  - Global click handler: tapping any <img> NOT inside an <a> or <button>
 *    and wider than 60 px opens the full-screen viewer automatically.
 *  - Images that have `data-fullscreen="true"` attribute  open the viewer
 *    even when they are inside an <a> or <button>.
 *  - Double-tap or +/- buttons to zoom in/out.
 *  - Swipe-down or tap the backdrop to close.
 *  - ESC key closes the viewer.
 */
export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);
  const [scale, setScale] = useState(1);
  const lastTapRef = useRef(0);
  const touchStartY = useRef(0);

  const openImage = useCallback((src: string, alt = '') => {
    if (!src) return;
    setImage({ src, alt });
    setScale(1);
  }, []);

  const closeImage = useCallback(() => {
    setImage(null);
    setScale(1);
  }, []);

  // ----- Global click delegation -----
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG') return;

      const img = target as HTMLImageElement;
      const isExplicit = img.getAttribute('data-fullscreen') === 'true';
      const isOptOut = img.getAttribute('data-no-fullscreen') === 'true';

      if (isOptOut) return;

      if (!isExplicit) {
        // Skip images inside anchor or button (preserve navigation / actions)
        if (img.closest('a') || img.closest('button')) return;
        // Skip tiny images (icons / logos)
        if (img.offsetWidth < 60) return;
      }

      if (isExplicit) {
        e.preventDefault();
        e.stopPropagation();
      }

      openImage(img.src, img.alt);
    };

    document.addEventListener('click', handleClick, { capture: false });
    return () => document.removeEventListener('click', handleClick, { capture: false } as any);
  }, [openImage]);

  // ----- Escape key -----
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeImage(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [image, closeImage]);

  // ----- Lock body scroll -----
  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [image]);

  // ----- Double-tap to zoom -----
  const handleDoubleTap = () => {
    setScale(prev => (prev === 1 ? 2.5 : 1));
  };

  // ----- Swipe-down to close -----
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80 && scale === 1) closeImage();
  };

  // ----- Double-click on desktop -----
  const handleImgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap();
    }
    lastTapRef.current = now;
  };

  return (
    <ImageViewerContext.Provider value={{ openImage, closeImage }}>
      {children}

      {image && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center select-none"
          onClick={closeImage}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeImage(); }}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-8 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.75, 5)); }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.75, 1)); }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              aria-label="Zoom out"
              disabled={scale <= 1}
            >
              <ZoomOut className={`w-5 h-5 ${scale <= 1 ? 'opacity-30' : ''}`} />
            </button>
          </div>

          {/* Image */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden p-4"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleTap}
          >
            <img
              src={image.src}
              alt={image.alt}
              onClick={handleImgClick}
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.25s ease',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                cursor: scale > 1 ? 'zoom-out' : 'zoom-in',
                borderRadius: '8px',
              }}
              draggable={false}
            />
          </div>

          {/* Caption */}
          {image.alt && (
            <div className="absolute bottom-4 left-0 right-16 px-6 pointer-events-none">
              <p className="text-white/60 text-xs text-center line-clamp-2">{image.alt}</p>
            </div>
          )}

          {/* Hint */}
          <p className="absolute top-4 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
            Double-tap to zoom · Swipe down to close
          </p>
        </div>
      )}
    </ImageViewerContext.Provider>
  );
}
