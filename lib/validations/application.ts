import { z } from "zod";
import { hackerFormSchema } from "@/lib/validations/hacker";
import { mentorFormSchema } from "@/lib/validations/mentor";

export const submitApplicationSchema = z.discriminatedUnion("account_type", [
  z.object({
    account_type: z.literal("hacker"),
    form: hackerFormSchema,
  }),
  z.object({
    account_type: z.literal("mentor"),
    form: mentorFormSchema,
  }),
]);

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;

export function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
