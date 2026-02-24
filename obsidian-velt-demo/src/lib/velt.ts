import { initVelt } from "@veltdev/client";

const VELT_API_KEY = "6xTcUFtlYAlCdh11zrKB";
const VELT_AUTH_TOKEN = "bd4d5226050470b6c658054fcdf1092a";

let veltClient: any = null;

export function getVeltClient() {
  return veltClient;
}

async function generateVeltToken(user: any): Promise<string> {
  const body = {
    data: {
      userId: user.userId,
      userProperties: {
        organizationId: user.organizationId,
        email: user.email || undefined,
      },
    },
  };

  const response = await fetch("https://api.velt.dev/v2/auth/token/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-velt-api-key": VELT_API_KEY,
      "x-velt-auth-token": VELT_AUTH_TOKEN,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  const token = json?.result?.data?.token;

  if (!response.ok || !token) {
    throw new Error(json?.error?.message || "Failed to generate token");
  }

  return token;
}

export async function initializeVelt() {
  if (veltClient) return veltClient;

  try {
    veltClient = await initVelt(VELT_API_KEY);
    console.log("[Velt] Client initialized");
    return veltClient;
  } catch (error) {
    console.error("[Velt] Failed to initialize:", error);
    throw error;
  }
}

export async function authenticateUser(user: any) {
  if (!veltClient) throw new Error("Velt client not initialized");
  if (!user) throw new Error("User is required");

  try {
    const token = await generateVeltToken(user);
    await veltClient.identify(user, { authToken: token });
    console.log("[Velt] User authenticated:", user.name);
  } catch (error) {
    console.error("[Velt] Token auth failed, fallback:", error);
    try {
      await veltClient.identify(user);
      console.log("[Velt] User authenticated (no token):", user.name);
    } catch (fallback) {
      console.error("[Velt] Fallback auth failed:", fallback);
      throw fallback;
    }
  }
}

export async function setVeltDocument(
  documentId: string,
  documentName = "Untitled",
) {
  if (!veltClient) throw new Error("Velt client not initialized");

  try {
    await veltClient.setDocument(documentId, { documentName });
    console.log("[Velt] Document set:", documentId);
  } catch (error) {
    console.error("[Velt] Failed to set document:", error);
    throw error;
  }
}

export function enableDarkMode() {
  if (veltClient) veltClient.setDarkMode(true);
}

export function disableDarkMode() {
  if (veltClient) veltClient.setDarkMode(false);
}

export function setVeltDarkMode(isDark: boolean) {
  if (veltClient) veltClient.setDarkMode(isDark);
}
