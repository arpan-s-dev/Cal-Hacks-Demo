import { z } from "zod";

export const HACKER_FORM_VERSION = "hacker-v1";

export const hackerFormSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(80),
  school: z.string().trim().min(1, "School is required").max(120),
  graduation_year: z.coerce.number().int().min(2024).max(2035),
  github: z.string().trim().url("Must be a URL").or(z.literal("")),
  linkedin: z.string().trim().url("Must be a URL").or(z.literal("")),
  track: z.enum(["general", "ai", "hardware", "design"]),
  why: z
    .string()
    .trim()
    .min(20, "Give us at least 20 characters")
    .max(1000),
  shirt_size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
});

export type HackerForm = z.infer<typeof hackerFormSchema>;
