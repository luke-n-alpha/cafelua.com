"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import "./ImageLightbox.css";

type ImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
  closeLabel: string;
  children?: ReactNode;
  closeOnImageClick?: boolean;
  detailsLayout?: boolean;
};

export default function ImageLightbox({
  src,
  alt,
  onClose,
  closeLabel,
  children,
  closeOnImageClick = false,
  detailsLayout = false,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div
      className={`image-lightbox${detailsLayout ? " image-lightbox-with-info" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <div className="image-lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          onClick={closeOnImageClick ? onClose : undefined}
        />
        {children && <div className="image-lightbox-info">{children}</div>}
      </div>
      <button
        className="image-lightbox-close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label={closeLabel}
      >
        <X size={17} />
        <span>{closeLabel}</span>
      </button>
    </div>
  );
}
