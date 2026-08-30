"use client";

import { colors, fonts } from "./theme";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";
import { SyncBadge } from "./SyncBadge";
import { logout } from "@/app/actions/auth";

type Props = Pick<
  ScrapLedgerViewModel,
  | "headerTitle"
  | "headerSubtitle"
  | "showBack"
  | "onBack"
  | "showHeaderAction"
  | "headerActionLabel"
  | "headerActionFn"
  | "syncStatus"
  | "isOnline"
>;

export function Header({
  headerTitle,
  headerSubtitle,
  showBack,
  onBack,
  showHeaderAction,
  headerActionLabel,
  headerActionFn,
  syncStatus,
  isOnline,
}: Props) {
  return (
    <>
      <div
        className="justify-center px-5 lg:justify-end lg:px-12"
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          textAlign: "center",
          borderBottom: `1px solid ${colors.borderHeader}`,
        }}
      >
        <div className="lg:hidden" style={{ fontSize: 11, letterSpacing: "0.16em", color: colors.accent, fontWeight: 700 }}>
          SCRAP LEDGER
        </div>
        <SyncBadge syncStatus={syncStatus} isOnline={isOnline} />
        <button
          onClick={() => logout()}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: colors.textFaint,
            fontSize: 11,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>

      <div
        className="px-5 py-4 md:px-9 lg:px-12 lg:py-5"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: `1px solid ${colors.borderHeader}`,
        }}
      >
        {showBack && (
          <button
            onClick={onBack}
            style={{
              width: 36,
              height: 36,
              flex: "none",
              borderRadius: 8,
              border: `1px solid ${colors.borderSoft}`,
              background: colors.surfaceInput,
              color: colors.accent,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ‹
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 22,
              color: colors.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {headerTitle}
          </div>
          {headerSubtitle && (
            <div
              style={{
                fontSize: 13,
                color: colors.textDim,
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {headerSubtitle}
            </div>
          )}
        </div>
        {showHeaderAction && (
          <button
            onClick={headerActionFn}
            style={{
              flex: "none",
              background: colors.accent,
              color: colors.accentText,
              border: "none",
              borderRadius: 8,
              padding: "10px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {headerActionLabel}
          </button>
        )}
      </div>
    </>
  );
}
