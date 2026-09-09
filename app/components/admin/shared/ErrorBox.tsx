import {
  CircleAlert,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";

export default function ErrorBox({
  message,
}: {
  message?: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={
        baseStyles.errorBox
      }
      role="alert"
    >
      <CircleAlert
        size={18}
        strokeWidth={2}
        aria-hidden="true"
      />

      <span>
        {message}
      </span>
    </div>
  );
}