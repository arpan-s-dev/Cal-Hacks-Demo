import type { QueueCursor } from "@/lib/types";

export function encodeCursor(row: QueueCursor): string {
  return Buffer.from(`${row.created_at}::${row.id}`).toString("base64url");
}

export function decodeCursor(value: string | undefined): QueueCursor | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const [created_at, id] = decoded.split("::");
    if (!created_at || !id) {
      return null;
    }
    return { created_at, id };
  } catch {
    return null;
  }
}
