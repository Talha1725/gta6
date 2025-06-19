import { LeakGenerationResponse } from "@/types";

const API_BASE_URL = "http://185.210.144.97:3000";

export async function generateLeak({
  keywords,
  gameTitle,
  includeImage,
  customerEmail,
}: {
  keywords: string[];
  gameTitle: string;
  includeImage: boolean;
  customerEmail?: string;
}): Promise<LeakGenerationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/leaks/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords, gameTitle, includeImage, customerEmail }),
  });
  if (!response.ok) throw new Error(await response.text());
  const result = await response.json();
  return result.data;
}

// Fetch leaks count for a user from the local API
export async function fetchLeaksCount(userId: string) {
  const res = await fetch(`/api/user/leaks?userId=${userId}`);
  return res.json();
} 