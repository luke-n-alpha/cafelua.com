"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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

  // 라이트박스는 position: fixed 이지만, 리더 패널에 걸린 backdrop-filter 가
  // 고정 위치의 기준 상자를 만들고 overflow: hidden 이 잘라낸다. 포털로 빼내
  // 뷰포트(또는 전체화면 요소) 바로 아래에 그려 위아래 잘림을 없앤다.
  const [mountTarget, setMountTarget] = useState<Element | null>(null);
  useEffect(() => {
    const resolveTarget = () => document.fullscreenElement ?? document.body;
    setMountTarget(resolveTarget());
    const sync = () => setMountTarget(resolveTarget());
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  if (!mountTarget) return null;

  return createPortal(
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
    </div>,
    mountTarget,
  );
}
