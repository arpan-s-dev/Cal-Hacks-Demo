export type ActionState = {
  ok: boolean;
  error: string;
  needsConfirm?: boolean;
};

export const emptyState: ActionState = { ok: false, error: "" };

export function fail(error: string): ActionState {
  return { ok: false, error };
}

export function firstZodError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}
