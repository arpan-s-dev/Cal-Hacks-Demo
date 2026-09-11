import { Field, SelectField, TextArea } from "@/components/Field";

export function HackerFields() {
  return (
    <div className="grid gap-4">
      <Field name="full_name" label="Full name" required />
      <Field name="school" label="School" required placeholder="UC Berkeley" />
      <Field
        name="graduation_year"
        label="Graduation year"
        type="number"
        required
        min={2024}
        max={2035}
      />
      <SelectField
        name="track"
        label="Primary track"
        required
        options={[
          { value: "general", label: "General" },
          { value: "ai", label: "AI / ML" },
          { value: "hardware", label: "Hardware" },
          { value: "design", label: "Design" },
        ]}
      />
      <Field name="github" label="GitHub URL" type="url" />
      <Field name="linkedin" label="LinkedIn URL" type="url" />
      <SelectField
        name="shirt_size"
        label="Shirt size"
        required
        options={["XS", "S", "M", "L", "XL", "XXL"].map((size) => ({
          value: size,
          label: size,
        }))}
      />
      <TextArea name="why" label="Why Cal Hacks? What will you build?" required />
    </div>
  );
}
