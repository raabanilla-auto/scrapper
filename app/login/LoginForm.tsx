"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { colors, fonts } from "@/components/scrap-ledger/theme";
import { Button, Field } from "@/components/scrap-ledger/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form
      action={formAction}
      style={{
        width: "100%",
        maxWidth: 340,
        background: colors.appBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 28,
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 22,
          color: colors.accent,
          textAlign: "center",
        }}
      >
        Scrap Ledger
      </div>
      <Field label="Password">
        <input
          type="password"
          name="password"
          autoFocus
          required
          style={{
            width: "100%",
            background: colors.surfaceInput,
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: 8,
            padding: 12,
            color: colors.text,
            fontSize: 15,
            outline: "none",
          }}
        />
      </Field>
      {state?.error && <div style={{ color: colors.danger, fontSize: 13 }}>{state.error}</div>}
      <Button variant="primary" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
