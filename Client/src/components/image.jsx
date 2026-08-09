import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt, loading = "lazy", fetchPriority }) => {
  if (!src) return null;

  const endpoint = import.meta.env.VITE_IK_URL_ENDPOINT;

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
        fetchpriority={fetchPriority}
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
      fetchpriority={fetchPriority}
    />
  );
};

export default Image;