import { z } from "zod";

export const MENTOR_FORM_VERSION = "mentor-v1";

export const mentorFormSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(80),
  company: z.string().trim().min(1, "Company is required").max(120),
  title: z.string().trim().min(1, "Title is required").max(120),
  years_experience: z.coerce.number().int().min(0).max(60),
  expertise: z.string().trim().min(3, "List your expertise").max(200),
  availability: z.enum(["saturday", "sunday", "both"]),
  why: z
    .string()
    .trim()
    .min(20, "Give us at least 20 characters")
    .max(1000),
  linkedin: z.string().trim().url("Must be a URL").or(z.literal("")),
});

export type MentorForm = z.infer<typeof mentorFormSchema>;
