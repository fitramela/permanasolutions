import type {
  ReactNode,
} from "react";

import {
  Inbox,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";

export default function EmptyState({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={
        baseStyles.emptyState
      }
    >
      <span
        className={
          baseStyles.emptyStateIcon
        }
      >
        <Inbox
          size={25}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <div>
        {children}
      </div>
    </div>
  );
}