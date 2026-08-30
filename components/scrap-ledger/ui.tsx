"use client";

import type { ReactNode } from "react";
import { colors } from "./theme";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: colors.textDim,
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputBase = {
  width: "100%",
  background: colors.surfaceInput,
  border: `1px solid ${colors.borderStrong}`,
  borderRadius: 8,
  padding: 12,
  color: colors.text,
  fontSize: 15,
  outline: "none",
} as const;

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} style={{ ...inputBase, ...props.style }} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} style={{ ...inputBase, ...props.style }} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputBase, resize: "vertical", ...props.style }} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        background: colors.surfaceInput,
        border: `1px solid ${colors.borderStrong}`,
        borderRadius: 8,
        padding: 10,
        color: colors.text,
        fontSize: 14,
        ...props.style,
      }}
    />
  );
}

export function Card({ children, style, accent }: { children: ReactNode; style?: React.CSSProperties; accent?: boolean }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${accent ? colors.accentBorder : colors.border}`,
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: colors.textDim,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "danger-outline" | "danger-solid" | "ghost";

const variantStyle: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: colors.accent, border: "none", color: colors.accentText, fontWeight: 700 },
  outline: {
    background: "transparent",
    border: `1px solid ${colors.borderStrong}`,
    color: colors.text,
    fontWeight: 700,
  },
  "danger-outline": {
    background: "transparent",
    border: `1px solid ${colors.dangerBorderStrong}`,
    color: colors.danger,
    fontWeight: 700,
  },
  "danger-solid": { background: colors.dangerSolid, border: "none", color: "oklch(0.98 0 0)", fontWeight: 700 },
  ghost: {
    background: "transparent",
    border: `1px solid ${colors.accentBorderSoft}`,
    color: colors.accent,
    fontWeight: 700,
  },
};

export function Button({
  variant = "outline",
  style,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...rest}
      style={{
        borderRadius: 10,
        padding: "13px",
        fontSize: 14,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        opacity: rest.disabled ? 0.5 : 1,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
