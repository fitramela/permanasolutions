"use client";

import {
  useState,
  type ChangeEvent,
} from "react";

import { adminFetch } from "../api";

import styles from "@/app/styles/admin/AdminUI.module.css";

import {
  getUploadUrl,
} from "./helpers";

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
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData =
        new FormData();

      /**
       * Backend menerima:
       *
       * upload.single("file")
       *
       * Jadi nama field HARUS "file".
       */
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

      if (!url) {
        throw new Error(
          "URL gambar tidak ditemukan dari response upload."
        );
      }

      /**
       * Masukkan URL hasil upload
       * ke field section.
       */
      onChange(
        url
      );
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Upload gagal."
      );
    } finally {
      setUploading(
        false
      );

      /**
       * Supaya file yang sama
       * bisa dipilih ulang.
       */
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

      {/* PREVIEW */}

      {value && (
        <div
          className={
            styles.mediaPreview
          }
        >
          <img
            src={value}
            alt={label}
          />
        </div>
      )}

      {/* UPLOAD FILE */}

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

      {/* URL MANUAL */}

      <input
        type="text"
        className={
          styles.input
        }
        value={value}
        placeholder="/images/example.png"
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
      />

      {/* STATUS */}

      {uploading && (
        <small
          className={
            styles.help
          }
        >
          Mengupload gambar...
        </small>
      )}

      {/* ERROR */}

      {error && (
        <small
          style={{
            color:
              "#b42318",
          }}
        >
          {error}
        </small>
      )}

    </div>
  );
}