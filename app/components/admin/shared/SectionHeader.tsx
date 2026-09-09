import type {
  ReactNode,
} from "react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";

export default function SectionHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={
        baseStyles.sectionHeader
      }
    >
      <div
        className={
          baseStyles.sectionHeaderContent
        }
      >
        <h1
          className={
            baseStyles.pageTitle
          }
        >
          {title}
        </h1>

        {desc && (
          <p
            className={
              baseStyles.pageDescription
            }
          >
            {desc}
          </p>
        )}
      </div>

      {action && (
        <div
          className={
            baseStyles.headerAction
          }
        >
          {action}
        </div>
      )}
    </div>
  );
}