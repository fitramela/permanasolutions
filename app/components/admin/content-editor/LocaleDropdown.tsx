"use client";

import type {
  Locale,
} from "./types";

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
    <div className="flex items-center gap-3">

      <span className="text-sm font-medium text-slate-600">
        Bahasa Konten
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target
              .value as Locale
          )
        }
        className="
          min-w-[170px]
          rounded-lg
          border
          border-slate-300
          bg-white
          px-4
          py-2
          text-sm
          text-slate-700
          outline-none
          transition
          focus:border-[#04BCBC]
          focus:ring-2
          focus:ring-[#04BCBC]/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
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