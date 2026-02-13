"use client";

import React from "react";
import {
  VeltProvider,
  useIdentify,
  useSetDocument,
  VeltCursor,
} from "@veltdev/react";
import { useCurrentDocument } from "@/lib/useCurrentDocument";

const GUEST_COLORS = [
  "#f87171",
  "#facc15",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
];

function getOrCreateGuest() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("excalidraw-guest-user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("excalidraw-guest-user");
    }
  }
  const guest = {
    userId: crypto.randomUUID(),
    name: `Guest-${Math.random().toString(36).slice(2, 6)}`,
    email: `guest-${Date.now()}@demo.local`,
    organizationId: "excalidraw-demo",
    color: GUEST_COLORS[Math.floor(Math.random() * GUEST_COLORS.length)],
  };
  localStorage.setItem("excalidraw-guest-user", JSON.stringify(guest));
  return guest;
}

function VeltIdentity({ children }: { children: React.ReactNode }) {
  const user = getOrCreateGuest();
  const { documentId } = useCurrentDocument();

  useIdentify(user);
  useSetDocument(documentId ?? "default-whiteboard");

  return <>{children}</>;
}

export function VeltSetup({ children }: { children: React.ReactNode }) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}>
      <VeltIdentity>
        <VeltCursor />
        {children}
      </VeltIdentity>
    </VeltProvider>
  );
}
