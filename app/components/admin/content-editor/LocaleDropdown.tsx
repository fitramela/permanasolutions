"use client";

import type {
  Locale,
} from "./types";

import styles from "@/app/styles/admin/AdminForm.module.css";

type Props = {
  value: Locale;

  onChange: (
    locale: Locale
  ) => void;

  disabled?: boolean;
};

export default function LocaleDropdown({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div
      className={
        styles.localeControl
      }
    >
      <label
        htmlFor="content-locale"
        className={
          styles.localeLabel
        }
      >
        Bahasa Konten
      </label>

      <select
        id="content-locale"
        value={value}
        disabled={disabled}
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value as Locale
          )
        }
        className={
          styles.localeSelect
        }
      >
        <option value="id">
          Indonesia
        </option>

        <option value="en">
          English
        </option>
      </select>
    </div>
  );
}