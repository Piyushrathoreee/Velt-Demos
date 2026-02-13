"use client";

import { useCommentAnnotations, VeltCommentPin } from "@veltdev/react";
import { Point } from "@/lib/types";
import { useWhiteboardStore } from "@/lib/useWhiteboardStore";

interface CanvasCommentLayerProps {
  zoom: number;
  pan: Point;
}

export function CanvasCommentLayer({ zoom, pan }: CanvasCommentLayerProps) {
  const commentAnnotations = useCommentAnnotations();
  const { rawMap } = useWhiteboardStore();
  const elements = rawMap ?? {};

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {commentAnnotations?.map((annotation) => {
        const ctx = annotation.context;
        if (!ctx) return null;

        let worldX = ctx.x;
        let worldY = ctx.y;

        // If attached to an element, snap to its center
        if (ctx.elementId) {
          const element = elements[ctx.elementId];
          if (element) {
            if (element.type === "pen") {
              // Simple center approx for pen
              const xs = element.points.map((p: any) => p.x);
              const ys = element.points.map((p: any) => p.y);
              worldX = (Math.min(...xs) + Math.max(...xs)) / 2;
              worldY = (Math.min(...ys) + Math.max(...ys)) / 2;
            } else if (
              element.type === "rect" ||
              element.type === "ellipse" ||
              element.type === "diamond" ||
              element.type === "text"
            ) {
              // Use bounds or specific fields
              // Normalized rect provided by normalizeRect helper? not available here easily.
              // Just use raw coords if available, or approximate.
              // Rect/Ellipse/Diamond have x1,y1,x2,y2 usually?
              // Wait, types.ts says DrawingElement...
              // Let's assume standard shape properties
              if (
                "x1" in element &&
                "y1" in element &&
                "x2" in element &&
                "y2" in element
              ) {
                worldX = (element.x1 + element.x2) / 2;
                worldY = (element.y1 + element.y2) / 2;
              }
            } else if (element.type === "line" || element.type === "arrow") {
              worldX = (element.x1 + element.x2) / 2;
              worldY = (element.y1 + element.y2) / 2;
            }
          }
        }

        if (typeof worldX !== "number" || typeof worldY !== "number") {
          return null;
        }

        const screenX = (worldX + pan.x) * zoom;
        const screenY = (worldY + pan.y) * zoom;

        return (
          <div
            key={annotation.annotationId}
            style={{
              position: "absolute",
              left: `${screenX}px`,
              top: `${screenY}px`,
              transform: "translate(-50%, -100%)",
              zIndex: 50,
              pointerEvents: "auto",
            }}
          >
            <VeltCommentPin annotationId={annotation.annotationId} />
          </div>
        );
      })}
    </div>
  );
}
