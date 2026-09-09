import {
  LoaderCircle,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";

export default function LoadingState({
  text = "Memuat data...",
}: {
  text?: string;
}) {
  return (
    <div
      className={
        baseStyles.loadingBox
      }
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        size={20}
        strokeWidth={2}
        className={
          baseStyles.spin
        }
        aria-hidden="true"
      />

      <span>
        {text}
      </span>
    </div>
  );
}