import { useState, useRef, useEffect } from "react";
import Image from "./image";

const ImageWithSkeleton = ({
  src,
  alt = "",
  className = "",
  w,
  h,
  aspectRatio = "aspect-[16/9]",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // Handle cached images where onLoad might have already triggered
  useEffect(() => {
    if (containerRef.current) {
      const img = containerRef.current.querySelector("img");
      if (img && img.complete && img.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-full overflow-hidden ${aspectRatio} ${className}`}
    >
      {/* 1. Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-slate-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* 2. Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
          Failed to load image
        </div>
      )}

      {/* 3. Actual Image */}
      <Image
        src={src}
        alt={alt}
        w={w}
        h={h}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover block transition-opacity duration-300 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageWithSkeleton;