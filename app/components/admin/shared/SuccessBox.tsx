import {
  CircleCheck,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";

export default function SuccessBox({
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
        baseStyles.successBox
      }
      role="status"
    >
      <CircleCheck
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