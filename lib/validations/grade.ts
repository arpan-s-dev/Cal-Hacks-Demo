import { z } from "zod";

export const gradeSchema = z.object({
  application_id: z.string().uuid(),
  score: z.coerce.number().int().min(1).max(5),
  notes: z.string().trim().min(1, "Notes are required").max(2000),
  status: z.enum(["accepted", "rejected", "waitlisted"]),
});

export type GradeInput = z.infer<typeof gradeSchema>;
