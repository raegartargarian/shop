"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutDraft } from "@/hooks/useCheckoutDraft";
import { cn } from "@/lib/cn";

type FieldKey = "cardholder" | "cardNumber" | "expiry" | "cvc";
type FormState = Record<FieldKey, string>;

const INITIAL: FormState = {
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function stripDigits(v: string): string {
  return v.replace(/\D+/g, "");
}

function validate(values: FormState): Partial<Record<FieldKey, string>> {
  const errs: Partial<Record<FieldKey, string>> = {};
  if (!values.cardholder.trim()) errs.cardholder = "cardholder is required";

  const num = stripDigits(values.cardNumber);
  if (!num) errs.cardNumber = "card number is required";
  else if (num.length < 13 || num.length > 16)
    errs.cardNumber = "card number looks invalid";

  if (!/^\d{2}\/\d{2}$/.test(values.expiry.trim())) {
    errs.expiry = "expiry must be MM/YY";
  } else {
    const [mm] = values.expiry.split("/");
    const month = Number(mm);
    if (month < 1 || month > 12) errs.expiry = "invalid month";
  }

  if (!/^\d{3,4}$/.test(values.cvc.trim())) {
    errs.cvc = "cvc must be 3 or 4 digits";
  }
  return errs;
}

export function PaymentForm() {
  const router = useRouter();
  const { setPayment } = useCheckoutDraft();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values);
  const showError = (field: FieldKey) =>
    (submitted || touched[field]) && errors[field];

  const onChange = (field: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let next = e.target.value;
      if (field === "cardNumber") next = stripDigits(next).slice(0, 16);
      if (field === "cvc") next = stripDigits(next).slice(0, 4);
      setValues((v) => ({ ...v, [field]: next }));
    };

  const onBlur = (field: FieldKey) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      const errs = validate(values);
      if (Object.keys(errs).length > 0) return;

      const num = stripDigits(values.cardNumber);
      // Only persist non-sensitive bits — never the full PAN.
      setPayment({
        cardholder: values.cardholder.trim(),
        last4: num.slice(-4),
        expiry: values.expiry.trim(),
      });
      router.push("/checkout/review");
    },
    [values, setPayment, router],
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-6"
    >
      <Field
        label="Cardholder name"
        name="cardholder"
        value={values.cardholder}
        onChange={onChange("cardholder")}
        onBlur={onBlur("cardholder")}
        error={showError("cardholder") ? errors.cardholder : undefined}
        autoComplete="cc-name"
      />
      <Field
        label="Card number"
        name="cardNumber"
        value={values.cardNumber}
        onChange={onChange("cardNumber")}
        onBlur={onBlur("cardNumber")}
        error={showError("cardNumber") ? errors.cardNumber : undefined}
        autoComplete="cc-number"
        inputMode="numeric"
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Expiry (MM/YY)"
          name="expiry"
          value={values.expiry}
          onChange={onChange("expiry")}
          onBlur={onBlur("expiry")}
          error={showError("expiry") ? errors.expiry : undefined}
          autoComplete="cc-exp"
          placeholder="MM/YY"
        />
        <Field
          label="CVC"
          name="cvc"
          value={values.cvc}
          onChange={onChange("cvc")}
          onBlur={onBlur("cvc")}
          error={showError("cvc") ? errors.cvc : undefined}
          autoComplete="cc-csc"
          inputMode="numeric"
        />
      </div>
      {/* TODO: real payment provider */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          Continue to review
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  placeholder?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  inputMode,
  placeholder,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink-700">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={cn(
          "rounded-md border bg-white px-3 py-2 text-ink-900 outline-none focus:border-accent",
          error ? "border-red-500" : "border-ink-200",
        )}
      />
      {error ? (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
