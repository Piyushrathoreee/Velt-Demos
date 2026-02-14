'use client'
import React, { useEffect, useState, Suspense } from "react";
import {
  VeltProvider,
  useSetDocument,
  VeltCursor,
  useVeltClient,
} from "@veltdev/react";
import { useCurrentDocument } from "@/lib/useCurrentDocument";
import { TEST_USERS } from "@/lib/users";
import { useSearchParams } from "next/navigation";

function VeltIdentity({ children }: { children: React.ReactNode }) {
  const { documentId } = useCurrentDocument();
  useSetDocument(documentId ?? "default-whiteboard");
  return <>{children}</>;
}

function VeltProviderInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(TEST_USERS[0]);

  useEffect(() => {
    const userIndex = searchParams.get("user");
    if (userIndex) {
      const index = parseInt(userIndex);
      if (!isNaN(index) && TEST_USERS[index]) {
        setUser(TEST_USERS[index]);
      }
    } else {
      // Fallback or default behavior
    }
  }, [searchParams]);

  return (
    <VeltProvider
      apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}
      authProvider={{
        user: user,
      }}
    >
      <VeltIdentity>
        {/* <VeltCursor /> */}
        {children}
      </VeltIdentity>
    </VeltProvider>
  );
}

export function VeltSetup({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <VeltProviderInner>{children}</VeltProviderInner>
    </Suspense>
  );
}
