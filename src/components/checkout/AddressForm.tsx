"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutDraft, type Address } from "@/hooks/useCheckoutDraft";
import { cn } from "@/lib/cn";

type FieldKey =
  | "fullName"
  | "line1"
  | "line2"
  | "city"
  | "state"
  | "postalCode"
  | "country";

type FormState = Record<FieldKey, string>;

const INITIAL: FormState = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

function validate(values: FormState): Partial<Record<FieldKey, string>> {
  const errs: Partial<Record<FieldKey, string>> = {};
  if (!values.fullName.trim()) errs.fullName = "full name is required";
  if (!values.line1.trim()) errs.line1 = "address line 1 is required";
  if (!values.city.trim()) errs.city = "city is required";
  if (!values.state.trim()) errs.state = "state is required";
  if (!values.postalCode.trim()) {
    errs.postalCode = "postal code is required";
  } else if (!/^[A-Za-z0-9 -]{3,10}$/.test(values.postalCode.trim())) {
    errs.postalCode = "postal code looks invalid";
  }
  if (!values.country.trim()) errs.country = "country is required";
  return errs;
}

export function AddressForm() {
  const router = useRouter();
  const { draft, setAddress } = useCheckoutDraft();
  const [values, setValues] = useState<FormState>(() => ({
    ...INITIAL,
    ...(draft.address ?? {}),
    line2: draft.address?.line2 ?? "",
  }));
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values);

  const showError = (field: FieldKey) =>
    (submitted || touched[field]) && errors[field];

  const onChange = (field: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
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

      const address: Address = {
        fullName: values.fullName.trim(),
        line1: values.line1.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        postalCode: values.postalCode.trim(),
        country: values.country.trim(),
      };
      const line2 = values.line2.trim();
      if (line2) address.line2 = line2;

      setAddress(address);
      router.push("/checkout/payment");
    },
    [values, setAddress, router],
  );

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-6"
    >
      <Field
        label="Full name"
        name="fullName"
        value={values.fullName}
        onChange={onChange("fullName")}
        onBlur={onBlur("fullName")}
        error={showError("fullName") ? errors.fullName : undefined}
        autoComplete="name"
      />
      <Field
        label="Address line 1"
        name="line1"
        value={values.line1}
        onChange={onChange("line1")}
        onBlur={onBlur("line1")}
        error={showError("line1") ? errors.line1 : undefined}
        autoComplete="address-line1"
      />
      <Field
        label="Address line 2 (optional)"
        name="line2"
        value={values.line2}
        onChange={onChange("line2")}
        onBlur={onBlur("line2")}
        autoComplete="address-line2"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="City"
          name="city"
          value={values.city}
          onChange={onChange("city")}
          onBlur={onBlur("city")}
          error={showError("city") ? errors.city : undefined}
          autoComplete="address-level2"
        />
        <Field
          label="State"
          name="state"
          value={values.state}
          onChange={onChange("state")}
          onBlur={onBlur("state")}
          error={showError("state") ? errors.state : undefined}
          autoComplete="address-level1"
        />
        <Field
          label="Postal code"
          name="postalCode"
          value={values.postalCode}
          onChange={onChange("postalCode")}
          onBlur={onBlur("postalCode")}
          error={showError("postalCode") ? errors.postalCode : undefined}
          autoComplete="postal-code"
        />
        <Field
          label="Country"
          name="country"
          value={values.country}
          onChange={onChange("country")}
          onBlur={onBlur("country")}
          error={showError("country") ? errors.country : undefined}
          autoComplete="country"
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          Continue to payment
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
};

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
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
