"use client";

import { colors } from "./theme";

type Props = { syncStatus: "local-only" | "syncing" | "synced" | "offline"; isOnline: boolean };

const labels: Record<Props["syncStatus"], string> = {
  "local-only": "Saved on device",
  syncing: "Syncing…",
  synced: "Synced",
  offline: "Offline",
};

const dotColor: Record<Props["syncStatus"], string> = {
  "local-only": colors.textFaint,
  syncing: colors.accent,
  synced: "oklch(0.7 0.15 150)",
  offline: colors.danger,
};

export function SyncBadge({ syncStatus, isOnline }: Props) {
  const status = !isOnline ? "offline" : syncStatus;
  return (
    <div
      title={
        status === "local-only"
          ? "No server configured — data stays on this device"
          : status === "offline"
            ? "You're offline — data is saved on this device"
            : undefined
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        color: colors.textFaint,
        letterSpacing: "0.04em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: dotColor[status],
          flex: "none",
        }}
      />
      {labels[status]}
    </div>
  );
}
