"use client";

import {
  useState,
  type ChangeEvent,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import {
  adminFetch,
} from "../api";

import {
  getUploadUrl,
} from "./helpers";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

type Props = {
  label: string;
  value: string;

  onChange: (
    url: string
  ) => void;
};

export default function ImageField({
  label,
  value,
  onChange,
}: Props) {
  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function upload(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0];

    if (
      !file
    ) {
      return;
    }

    try {
      setUploading(
        true
      );

      setError("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await adminFetch<any>(
          "/upload/image",
          {
            method:
              "POST",

            body:
              formData,
          }
        );

      const url =
        getUploadUrl(
          response
        );

      if (
        !url
      ) {
        throw new Error(
          "URL gambar tidak ditemukan dari response upload."
        );
      }

      onChange(
        url
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Upload gagal."
      );
    } finally {
      setUploading(
        false
      );

      event.target.value =
        "";
    }
  }

  return (
    <div
      className={`${styles.field} ${styles.full}`}
    >
      <label>
        {label}
      </label>

      {value && (
        <div
          className={
            styles.mediaPreview
          }
        >
          <img
            src={
              value
            }
            alt={
              label
            }
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className={
          styles.fileInput
        }
        onChange={
          upload
        }
        disabled={
          uploading
        }
      />

      <input
        type="text"
        className={
          styles.input
        }
        value={
          value
        }
        disabled={
          uploading
        }
        placeholder="/images/example.png"
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      />

      {uploading && (
        <small
          className={
            styles.help
          }
        >
          <LoaderCircle
            size={14}
            className={
              styles.spin
            }
          />

          <span>
            Mengupload gambar...
          </span>
        </small>
      )}

      {error && (
        <small
          className={
            styles.fieldError
          }
        >
          {error}
        </small>
      )}
    </div>
  );
}