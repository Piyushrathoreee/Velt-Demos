"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { useEditorStore, DocumentType } from "@/lib/store";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  doc: DocumentType;
}

interface Edge {
  source: string;
  target: string;
}

const NODE_COLORS = [
  "#7c3aed",
  "#6d28d9",
  "#8b5cf6",
  "#a78bfa",
  "#6366f1",
  "#818cf8",
  "#4f46e5",
  "#c084fc",
];

function buildGraph(documents: DocumentType[]): {
  nodes: Node[];
  edges: Edge[];
} {
  const centerX = 400;
  const centerY = 300;
  const spread = 200;

  const nodes: Node[] = documents.map((doc, i) => {
    const angle = (2 * Math.PI * i) / documents.length;
    const r = spread + Math.random() * 80;
    return {
      id: doc.id,
      label: doc.name,
      x: centerX + r * Math.cos(angle) + (Math.random() - 0.5) * 40,
      y: centerY + r * Math.sin(angle) + (Math.random() - 0.5) * 40,
      vx: 0,
      vy: 0,
      radius: 6 + Math.min(doc.content.length / 200, 8),
      color: NODE_COLORS[i % NODE_COLORS.length],
      doc,
    };
  });

  // Create edges based on content references (if doc mentions another doc's name)
  const edges: Edge[] = [];
  for (let i = 0; i < documents.length; i++) {
    for (let j = i + 1; j < documents.length; j++) {
      const contentI = documents[i].content.toLowerCase();
      const contentJ = documents[j].content.toLowerCase();
      const nameI = documents[i].name.toLowerCase();
      const nameJ = documents[j].name.toLowerCase();

      if (contentI.includes(nameJ) || contentJ.includes(nameI)) {
        edges.push({ source: documents[i].id, target: documents[j].id });
      }
    }
    // Also connect adjacent documents to ensure some connectivity
    if (i < documents.length - 1) {
      const hasEdge = edges.some(
        (e) =>
          (e.source === documents[i].id && e.target === documents[i + 1].id) ||
          (e.target === documents[i].id && e.source === documents[i + 1].id),
      );
      if (!hasEdge && Math.random() > 0.4) {
        edges.push({ source: documents[i].id, target: documents[i + 1].id });
      }
    }
  }

  return { nodes, edges };
}

export default function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const documents = useEditorStore((state) => state.documents);
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const setCurrentDocument = useEditorStore(
    (state) => state.setCurrentDocument,
  );
  const setActiveView = useEditorStore((state) => state.setActiveView);

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const dragNodeRef = useRef<Node | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const panRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0, mx: 0, my: 0 });
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const hoveredNodeRef = useRef<Node | null>(null);
  const isPanningRef = useRef(false);

  // Initialize graph
  useEffect(() => {
    const { nodes, edges } = buildGraph(documents);
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [documents]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      // Center pan
      panRef.current = {
        x: container.clientWidth / 2 - 400,
        y: container.clientHeight / 2 - 300,
      };
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Force simulation + rendering loop
  const simulate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const pan = panRef.current;
    const z = zoomRef.current;

    // Force simulation — tuned for quick stabilization
    const damping = 0.7;
    const repulsion = 1200;
    const attraction = 0.008;
    const idealLength = 140;
    const velocityThreshold = 0.05;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === dragNodeRef.current) continue;

      let fx = 0;
      let fy = 0;

      // Repulsion between all nodes
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }

      // Attraction along edges
      for (const edge of edges) {
        let other: Node | undefined;
        if (edge.source === nodes[i].id) {
          other = nodes.find((n) => n.id === edge.target);
        } else if (edge.target === nodes[i].id) {
          other = nodes.find((n) => n.id === edge.source);
        }
        if (other) {
          const dx = other.x - nodes[i].x;
          const dy = other.y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - idealLength) * attraction;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      }

      // Center gravity
      fx += (400 - nodes[i].x) * 0.002;
      fy += (300 - nodes[i].y) * 0.002;

      nodes[i].vx = (nodes[i].vx + fx) * damping;
      nodes[i].vy = (nodes[i].vy + fy) * damping;

      // Snap to rest when nearly stopped
      if (Math.abs(nodes[i].vx) < velocityThreshold) nodes[i].vx = 0;
      if (Math.abs(nodes[i].vy) < velocityThreshold) nodes[i].vy = 0;

      nodes[i].x += nodes[i].vx;
      nodes[i].y += nodes[i].vy;
    }

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(z, z);

    // Draw edges
    for (const edge of edges) {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (src && tgt) {
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = "rgba(124, 58, 237, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNodeRef.current?.id === node.id;
      const isCurrent = currentDocument?.id === node.id;
      const r = node.radius * (isHovered ? 1.3 : 1);

      // Glow for current/hovered
      if (isCurrent || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          r,
          node.x,
          node.y,
          r + 8,
        );
        gradient.addColorStop(
          0,
          isCurrent ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.2)",
        );
        gradient.addColorStop(1, "rgba(124, 58, 237, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? "#a78bfa" : node.color;
      ctx.fill();

      // Border
      if (isCurrent) {
        ctx.strokeStyle = "#c4b5fd";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = isHovered || isCurrent ? "#e0e0e0" : "#999";
      ctx.font = `${isHovered || isCurrent ? "12px" : "11px"} Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + r + 16);
    }

    ctx.restore();

    animFrameRef.current = requestAnimationFrame(simulate);
  }, [currentDocument]);

  // Start animation
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [simulate]);

  // Mouse handlers
  const getGraphCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const z = zoomRef.current;
    return {
      x: (e.clientX - rect.left - panRef.current.x) / z,
      y: (e.clientY - rect.top - panRef.current.y) / z,
    };
  };

  const findNode = (gx: number, gy: number): Node | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dx = gx - nodes[i].x;
      const dy = gy - nodes[i].y;
      if (dx * dx + dy * dy < (nodes[i].radius + 5) * (nodes[i].radius + 5)) {
        return nodes[i];
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getGraphCoords(e);
    const node = findNode(x, y);
    mouseRef.current = { x: e.clientX, y: e.clientY, down: true };
    if (node) {
      dragNodeRef.current = node;
    } else {
      isPanningRef.current = true;
      panStartRef.current = {
        x: panRef.current.x,
        y: panRef.current.y,
        mx: e.clientX,
        my: e.clientY,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getGraphCoords(e);
    hoveredNodeRef.current = findNode(x, y);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = hoveredNodeRef.current
        ? "pointer"
        : isPanningRef.current
          ? "grabbing"
          : "grab";
    }

    if (dragNodeRef.current) {
      dragNodeRef.current.x = x;
      dragNodeRef.current.y = y;
      dragNodeRef.current.vx = 0;
      dragNodeRef.current.vy = 0;
    } else if (isPanningRef.current) {
      panRef.current = {
        x: panStartRef.current.x + (e.clientX - panStartRef.current.mx),
        y: panStartRef.current.y + (e.clientY - panStartRef.current.my),
      };
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasDrag =
      Math.abs(e.clientX - mouseRef.current.x) > 3 ||
      Math.abs(e.clientY - mouseRef.current.y) > 3;

    if (!wasDrag && dragNodeRef.current) {
      // Click on node → select document and go to editor
      setCurrentDocument(dragNodeRef.current.doc);
      setActiveView("editor");
    }

    dragNodeRef.current = null;
    isPanningRef.current = false;
    mouseRef.current.down = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    const newZoom = Math.min(3, Math.max(0.3, zoomRef.current * delta));
    zoomRef.current = newZoom;
    setZoom(newZoom);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          dragNodeRef.current = null;
          isPanningRef.current = false;
          hoveredNodeRef.current = null;
        }}
        onWheel={handleWheel}
        className="block w-full h-full"
        style={{ cursor: "grab" }}
      />

      {/* Zoom indicator */}
      <div
        className="absolute bottom-4 right-4 rounded px-3 py-1.5 text-xs"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          color: "var(--text-muted)",
        }}
      >
        {Math.round(zoom * 100)}%
      </div>

      {/* Info overlay */}
      <div
        className="absolute top-4 left-4 text-xs"
        style={{ color: "var(--text-faint)" }}
      >
        <p>Drag to move nodes · Scroll to zoom · Click node to open</p>
      </div>
    </div>
  );
}
