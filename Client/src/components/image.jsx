import { IKImage } from "imagekitio-react";

const Image = ({
  src,
  className,
  w,
  h,
  alt,
  loading = "lazy",
  fetchpriority,
  onLoad,
  onError,
}) => {
  if (!src) return null;

  if (src.includes("ik.imagekit.io")) {
    const transformationStr = `tr=w-${w || 400},h-${h || 250},fo-auto,q-80`;
    const optimizedSrc = src.includes("?")
      ? `${src}&${transformationStr}`
      : `${src}?${transformationStr}`;

    return (
      <img
        src={optimizedSrc}
        className={className}
        alt={alt || "Blog image"}
        width={w}
        height={h}
        loading={loading}
        fetchpriority={fetchpriority}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  // Fallback img
  return (
    <img
      src={src}
      className={className}
      alt={alt || "Blog image"}
      width={w}
      height={h}
      loading={loading}
      fetchpriority={fetchpriority}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default Image;