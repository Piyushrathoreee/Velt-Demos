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

interface GNode {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface GEdge {
  source: string;
  target: string;
}

const sections = [
  "Attention Is All You Need",
  "Abstract",
  "Introduction",
  "Background",
  "Model Architecture",
  "Self-Attention",
  "Training",
  "Results",
  "Conclusion",
  "References",
];

function buildGraph(): { nodes: GNode[]; edges: GEdge[] } {
  const cx = 400,
    cy = 300;

  const nodes: GNode[] = sections.map((name, i) => {
    const isTitle = i === 0;
    const angle = (2 * Math.PI * (i - 1)) / (sections.length - 1);
    const spread = 150 + Math.random() * 50;
    return {
      id: `s-${i}`,
      label: name,
      x: isTitle
        ? cx
        : cx + spread * Math.cos(angle) + (Math.random() - 0.5) * 20,
      y: isTitle
        ? cy
        : cy + spread * Math.sin(angle) + (Math.random() - 0.5) * 20,
      vx: 0,
      vy: 0,
      radius: isTitle ? 8 : 5,
      color: NODE_COLORS[i % NODE_COLORS.length],
    };
  });

  const edges: GEdge[] = [];
  // Title connects to all
  for (let i = 1; i < nodes.length; i++)
    edges.push({ source: nodes[0].id, target: nodes[i].id });
  // Sequential
  for (let i = 1; i < nodes.length - 1; i++)
    edges.push({ source: nodes[i].id, target: nodes[i + 1].id });

  return { nodes, edges };
}

export function createGraphView(
  container: HTMLElement,
  onSelectSection?: (label: string) => void,
) {
  const wrapper = document.createElement("div");
  wrapper.className = "graph-container";

  const canvas = document.createElement("canvas");
  wrapper.appendChild(canvas);

  const info = document.createElement("div");
  info.className = "graph-info";
  info.textContent = "Drag nodes · Scroll to zoom · Click to open";
  wrapper.appendChild(info);

  const zoomIndicator = document.createElement("div");
  zoomIndicator.className = "graph-zoom";
  zoomIndicator.textContent = "100%";
  wrapper.appendChild(zoomIndicator);

  container.appendChild(wrapper);

  const { nodes, edges } = buildGraph();
  let zoom = 1,
    panX = 0,
    panY = 0;
  let dragNode: GNode | null = null,
    hoveredNode: GNode | null = null;
  let isPanning = false,
    panSX = 0,
    panSY = 0,
    panSMX = 0,
    panSMY = 0;
  let mdX = 0,
    mdY = 0,
    animFrame = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wrapper.clientWidth * dpr;
    canvas.height = wrapper.clientHeight * dpr;
    canvas.style.width = wrapper.clientWidth + "px";
    canvas.style.height = wrapper.clientHeight + "px";
    canvas.getContext("2d")?.scale(dpr, dpr);
    panX = wrapper.clientWidth / 2 - 400;
    panY = wrapper.clientHeight / 2 - 300;
  }
  resize();
  window.addEventListener("resize", resize);

  function gCoords(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - panX) / zoom,
      y: (e.clientY - r.top - panY) / zoom,
    };
  }

  function findNode(gx: number, gy: number): GNode | null {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dx = gx - nodes[i].x,
        dy = gy - nodes[i].y;
      if (dx * dx + dy * dy < (nodes[i].radius + 6) ** 2) return nodes[i];
    }
    return null;
  }

  function simulate() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr,
      h = canvas.height / dpr;
    const isDark = document.documentElement.classList.contains("dark");

    // Physics
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === dragNode) continue;
      let fx = 0,
        fy = 0;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x,
          dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = 1800 / (d * d);
        fx += (dx / d) * f;
        fy += (dy / d) * f;
      }
      for (const e of edges) {
        let o: GNode | undefined;
        if (e.source === nodes[i].id) o = nodes.find((n) => n.id === e.target);
        else if (e.target === nodes[i].id)
          o = nodes.find((n) => n.id === e.source);
        if (o) {
          const dx = o.x - nodes[i].x,
            dy = o.y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = (d - 140) * 0.007;
          fx += (dx / d) * f;
          fy += (dy / d) * f;
        }
      }
      fx += (400 - nodes[i].x) * 0.001;
      fy += (300 - nodes[i].y) * 0.001;
      nodes[i].vx = (nodes[i].vx + fx) * 0.65;
      nodes[i].vy = (nodes[i].vy + fy) * 0.65;
      if (Math.abs(nodes[i].vx) < 0.02) nodes[i].vx = 0;
      if (Math.abs(nodes[i].vy) < 0.02) nodes[i].vy = 0;
      nodes[i].x += nodes[i].vx;
      nodes[i].y += nodes[i].vy;
    }

    // Clear
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = isDark ? "#1e1e1e" : "#fafafa";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Edges
    for (const e of edges) {
      const s = nodes.find((n) => n.id === e.source);
      const t = nodes.find((n) => n.id === e.target);
      if (!s || !t) continue;
      const hl = hoveredNode?.id === s.id || hoveredNode?.id === t.id;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = hl
        ? isDark
          ? "rgba(167,139,250,0.4)"
          : "rgba(124,58,237,0.3)"
        : isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.08)";
      ctx.lineWidth = hl ? 1.5 : 1;
      ctx.stroke();
    }

    // Nodes
    for (const node of nodes) {
      const hov = hoveredNode?.id === node.id;
      const r = node.radius * (hov ? 1.3 : 1);

      // Simple glow on hover
      if (hov) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? "rgba(124,58,237,0.15)"
          : "rgba(124,58,237,0.1)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Label
      ctx.fillStyle = hov
        ? isDark
          ? "#e0e0e0"
          : "#222"
        : isDark
          ? "#777"
          : "#888";
      ctx.font = `${hov ? "500 11px" : "400 10px"} Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + r + 14);
    }

    ctx.restore();
    animFrame = requestAnimationFrame(simulate);
  }

  // Mouse
  canvas.addEventListener("mousedown", (e) => {
    const c = gCoords(e);
    mdX = e.clientX;
    mdY = e.clientY;
    const n = findNode(c.x, c.y);
    if (n) dragNode = n;
    else {
      isPanning = true;
      panSX = panX;
      panSY = panY;
      panSMX = e.clientX;
      panSMY = e.clientY;
    }
  });
  canvas.addEventListener("mousemove", (e) => {
    const c = gCoords(e);
    hoveredNode = findNode(c.x, c.y);
    canvas.style.cursor = hoveredNode
      ? "pointer"
      : isPanning
        ? "grabbing"
        : "grab";
    if (dragNode) {
      dragNode.x = c.x;
      dragNode.y = c.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else if (isPanning) {
      panX = panSX + (e.clientX - panSMX);
      panY = panSY + (e.clientY - panSMY);
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    if (
      Math.abs(e.clientX - mdX) < 4 &&
      Math.abs(e.clientY - mdY) < 4 &&
      dragNode &&
      onSelectSection
    ) {
      onSelectSection(dragNode.label);
    }
    dragNode = null;
    isPanning = false;
  });
  canvas.addEventListener("mouseleave", () => {
    dragNode = null;
    isPanning = false;
    hoveredNode = null;
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      zoom = Math.min(3, Math.max(0.3, zoom * (e.deltaY > 0 ? 0.95 : 1.05)));
      zoomIndicator.textContent = `${Math.round(zoom * 100)}%`;
    },
    { passive: false },
  );

  animFrame = requestAnimationFrame(simulate);

  return {
    el: wrapper,
    destroy() {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      wrapper.remove();
    },
  };
}
