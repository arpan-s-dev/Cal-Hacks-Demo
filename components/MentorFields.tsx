import { Field, SelectField, TextArea } from "@/components/Field";

export function MentorFields() {
  return (
    <div className="grid gap-4">
      <Field name="full_name" label="Full name" required />
      <Field name="company" label="Company / org" required />
      <Field name="title" label="Title" required />
      <Field
        name="years_experience"
        label="Years of experience"
        type="number"
        required
        min={0}
        max={60}
      />
      <Field
        name="expertise"
        label="Expertise"
        required
        placeholder="iOS, ML infra, design systems…"
      />
      <SelectField
        name="availability"
        label="Availability"
        required
        options={[
          { value: "saturday", label: "Saturday" },
          { value: "sunday", label: "Sunday" },
          { value: "both", label: "Both days" },
        ]}
      />
      <Field name="linkedin" label="LinkedIn URL" type="url" />
      <TextArea
        name="why"
        label="Why do you want to mentor this weekend?"
        required
      />
    </div>
  );
}
