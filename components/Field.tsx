type FieldProps = {
  name: string;
  label: string;
  type?: "text" | "url" | "number" | "email" | "password";
  required?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
};

export function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  placeholder,
  min,
  max,
}: FieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-paper/80">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        className="h-11 rounded-md border border-line bg-ink px-3 text-paper outline-none focus:border-gold"
      />
    </label>
  );
}

export function TextArea({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-paper/80">{label}</span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={5}
        className="rounded-md border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-gold"
      />
    </label>
  );
}

export function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-paper/80">{label}</span>
      <select
        name={name}
        required={required}
        className="h-11 rounded-md border border-line bg-ink px-3 text-paper outline-none focus:border-gold"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
