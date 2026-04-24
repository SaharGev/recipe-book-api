const BASE_URL = "/comments";

export async function getComments(targetType: string, targetId: string) {
  const res = await fetch(`${BASE_URL}?targetType=${targetType}&targetId=${targetId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch comments");
  return data;
}

export async function createComment(targetType: string, targetId: string, content: string, token: string) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetType, targetId, content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create comment");
  return data;
}

export async function deleteComment(commentId: string, token: string) {
  const res = await fetch(`${BASE_URL}/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete comment");
  return data;
}

export async function getCommentCount(targetType: string, targetId: string): Promise<number> {
  try {
    const res = await fetch(`${BASE_URL}?targetType=${targetType}&targetId=${targetId}`);
    const data = await res.json();
    if (!res.ok) return 0;
    return data.length;
  } catch {
    return 0;
  }
}
