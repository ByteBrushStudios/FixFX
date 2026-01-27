"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  caption?: string;
}

export function ImageModal({
  src,
  alt,
  title,
  width,
  height,
  className,
  caption,
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modal = (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          zIndex: 9998,
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 10000,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "0.5rem",
            color: "white",
            border: "none",
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          type="button"
          aria-label="Close image"
        >
          <X style={{ width: 24, height: 24 }} />
        </button>

        {/* Image Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: "90vh",
            maxWidth: "90vw",
            pointerEvents: "auto",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxHeight: "85vh",
              maxWidth: "90vw",
              height: "auto",
              width: "auto",
              borderRadius: "0.5rem",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Title */}
          {title && (
            <p
              style={{
                marginTop: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {title}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <figure className="my-4">
      {/* Thumbnail */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative block w-full cursor-pointer overflow-hidden rounded-lg border border-fd-border bg-fd-muted/30 transition-all hover:border-fd-primary/50 hover:shadow-lg ${className || ""}`}
        type="button"
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block w-full h-auto"
        />
      </button>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}

      {/* Portal to body */}
      {mounted && isOpen && createPortal(modal, document.body)}
    </figure>
  );
}
