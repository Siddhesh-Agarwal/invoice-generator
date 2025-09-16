import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {isValidDate} from "@/lib/date-utils";
import {cn} from "@/lib/utils";
import * as React from "react";

type DateParts = {month: number; day: number; year: number};

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(month: number, year: number) {
  return (
    [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month - 1
    ] ?? 31
  );
}

function validateDate(parts: Partial<DateParts>): {
  valid: boolean;
  message?: string;
} {
  const {month, day, year} = parts;
  if (month == null || month < 1 || month > 12)
    return {valid: false, message: "Enter a valid month (01-12)."};
  if (year == null || year < 1900 || year > 2100)
    return {valid: false, message: "Enter a valid year (1900-2100)."};
  if (day == null || day < 1 || day > daysInMonth(month, year))
    return {valid: false, message: "Enter a valid day for the month."};
  return {valid: true};
}

function toISO(parts: DateParts) {
  const mm = String(parts.month).padStart(2, "0");
  const dd = String(parts.day).padStart(2, "0");
  const yyyy = String(parts.year).padStart(4, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseFromDigits(digits: string): {text: string; parts?: DateParts} {
  const only = digits.replace(/\D/g, "").slice(0, 8); // MMDDYYYY
  let mm = "";
  let dd = "";
  let yyyy = "";
  if (only.length <= 2) {
    mm = only;
  } else if (only.length <= 4) {
    mm = only.slice(0, 2);
    dd = only.slice(2);
  } else {
    mm = only.slice(0, 2);
    dd = only.slice(2, 4);
    yyyy = only.slice(4);
  }
  const text = [mm, dd, yyyy].filter(Boolean).join("/");
  const partsReady = mm.length === 2 && dd.length === 2 && yyyy.length === 4;
  const parts = partsReady
    ? {month: Number(mm), day: Number(dd), year: Number(yyyy)}
    : undefined;
  return {text, parts};
}

function fromISOToText(iso?: string) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${mo}/${d}/${y}`;
}

export type DateTextInputProps = {
  id?: string;
  label?: string;
  required?: boolean;
  className?: string;
  defaultISO?: string; // optional initial value as YYYY-MM-DD
  onValidDate?: (payload: {iso: string; parts: DateParts}) => void;
  onChangeText?: (text: string) => void;
  helpText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function DateInput({
  id,
  label = "Date",
  required,
  className,
  defaultISO,
  onValidDate,
  onChangeText,
  helpText = "Enter date as MM/DD/YYYY",
  disabled,
  autoFocus,
}: DateTextInputProps) {
  const [text, setText] = React.useState(fromISOToText(defaultISO));
  const [error, setError] = React.useState<string | undefined>(undefined);

  const describedById = id ? `${id}-desc` : undefined;
  const errorId = id ? `${id}-error` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseFromDigits(e.target.value);
    setText(next.text);
    onChangeText?.(next.text);

    if (next.parts) {
      const ok = isValidDate(next.parts);
      if (ok) {
        setError(undefined);
        onValidDate?.({iso: toISO(next.parts), parts: next.parts});
      } else {
        // Keep existing, more specific error messages
        const res = validateDate(next.parts);
        setError(res.message);
      }
    } else {
      // Partial input -> no error yet
      setError(undefined);
    }
  };

  const handleBlur = () => {
    const digits = text.replace(/\D/g, "");
    if (digits.length === 8) {
      const {parts} = parseFromDigits(digits);
      if (parts) {
        const ok = isValidDate(parts);
        setError(ok ? undefined : validateDate(parts).message);
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="MM/DD/YYYY"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby={cn(describedById, error ? errorId : undefined)}
        aria-invalid={error ? "true" : "false"}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <div className="text-muted-foreground text-sm" id={describedById}>
        {helpText}
      </div>
      {error ? (
        <div className="text-destructive text-sm" id={errorId} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
