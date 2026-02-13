"use client";

import React, { useEffect } from "react";

import {
  VeltProvider,
  useIdentify,
  useSetDocument,
  useVeltClient,
} from "@veltdev/react";
import { useCurrentDocument } from "@/lib/useCurrentDocument";

import { TEST_USERS } from "@/lib/users";

function VeltIdentity({ children }: { children: React.ReactNode }) {
  const { client } = useVeltClient();
  const { documentId } = useCurrentDocument();

  useEffect(() => {
    if (client) {
      // Check for user in URL or storage, fallback to random
      const params = new URLSearchParams(window.location.search);
      const userIndex = params.get("user");

      let selectedUser =
        TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];

      if (userIndex) {
        const index = parseInt(userIndex);
        if (!isNaN(index) && TEST_USERS[index]) {
          selectedUser = TEST_USERS[index];
        }
      }

      client.identify(selectedUser);
    }
  }, [client]);

  useSetDocument(documentId ?? "default-whiteboard");

  return <>{children}</>;
}

export function VeltSetup({ children }: { children: React.ReactNode }) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}>
      <VeltIdentity>{children}</VeltIdentity>
    </VeltProvider>
  );
}
