export interface DemoUser {
  userId: string;
  name: string;
  email: string;
  organizationId: string;
  photoUrl: string;
  color: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    userId: "user-ash",
    name: "Ash Ketchum",
    email: "ash@example.com",
    organizationId: "obsidian-velt-demo-org",
    photoUrl:
      "https://ui-avatars.com/api/?name=Ash+Ketchum&background=7c3aed&color=fff&size=128",
    color: "#7c3aed",
  },
  {
    userId: "user-misty",
    name: "Misty",
    email: "misty@example.com",
    organizationId: "obsidian-velt-demo-org",
    photoUrl:
      "https://ui-avatars.com/api/?name=Misty&background=6366f1&color=fff&size=128",
    color: "#6366f1",
  },
];

const STORAGE_KEY = "obsidian-velt-user-index";

let currentUserIndex: number = 0;

export function getCurrentUserIndex(): number {
  return currentUserIndex;
}

export function getUser(): DemoUser {
  return DEMO_USERS[currentUserIndex];
}

export function initializeUser(): DemoUser {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    const idx = parseInt(stored, 10);
    if (idx >= 0 && idx < DEMO_USERS.length) {
      currentUserIndex = idx;
    }
  }
  return DEMO_USERS[currentUserIndex];
}

export async function switchUser(index: number): Promise<void> {
  if (index < 0 || index >= DEMO_USERS.length) return;
  localStorage.setItem(STORAGE_KEY, index.toString());

  try {
    const { getVeltClient } = await import("./velt");
    const client = getVeltClient();
    if (client) {
      await client.signOutUser();
      console.log("[User] Signed out from Velt before switching");
    }
  } catch (e) {
    console.warn("[User] Could not sign out:", e);
  }

  window.location.reload();
}
