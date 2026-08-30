"use client";

import { colors, fonts } from "../theme";
import { Button } from "../ui";

export function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: colors.overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: colors.surfaceModal,
          border: `1px solid ${colors.borderStrong}`,
          borderRadius: 16,
          padding: 22,
          width: "100%",
          maxWidth: 340,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, color: colors.textDim, marginBottom: 20 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger-solid" style={{ flex: 1 }} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
