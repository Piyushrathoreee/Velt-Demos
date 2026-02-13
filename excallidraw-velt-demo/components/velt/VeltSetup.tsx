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
  const users = [
    {
      userId: "user1",
      name: "User 1",
      email: "user1@velt.dev",
      photoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
      color: "#F97316", // Orange
    },
    {
      userId: "user2",
      name: "User 2",
      email: "user2@velt.dev",
      photoUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka",
      color: "#3B82F6", // Blue
    },
  ];

  // Randomly select, but maybe we can cycle based on time or something to be deterministic for testing if needed
  const randomUser = users[Math.floor(Math.random() * users.length)];

  // The original code had `await client.identify(randomUser);tItem("excalidraw-guest-user", JSON.stringify(guest));`
  // This seems to be a malformed snippet.
  // Assuming the intent is to use one of these predefined users as the "guest"
  // and store it, similar to the original guest generation logic.
  const guest = {
    ...randomUser,
    organizationId: "excalidraw-demo", // Keep organizationId from original guest logic
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
