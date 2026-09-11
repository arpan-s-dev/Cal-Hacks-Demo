import type { AccountType } from "@/lib/types";

const LABELS: Record<string, string> = {
  full_name: "Full name",
  school: "School",
  graduation_year: "Graduation year",
  github: "GitHub",
  linkedin: "LinkedIn",
  track: "Track",
  why: "Why Cal Hacks",
  shirt_size: "Shirt size",
  company: "Company",
  title: "Title",
  years_experience: "Years of experience",
  expertise: "Expertise",
  availability: "Availability",
};

export function formEntries(
  accountType: AccountType,
  formData: Record<string, string | number>,
): { label: string; value: string }[] {
  const order =
    accountType === "hacker"
      ? [
          "full_name",
          "school",
          "graduation_year",
          "track",
          "github",
          "linkedin",
          "shirt_size",
          "why",
        ]
      : [
          "full_name",
          "company",
          "title",
          "years_experience",
          "expertise",
          "availability",
          "linkedin",
          "why",
        ];

  return order
    .filter((key) => formData[key] !== undefined && formData[key] !== "")
    .map((key) => ({
      label: LABELS[key] ?? key,
      value: String(formData[key]),
    }));
}
