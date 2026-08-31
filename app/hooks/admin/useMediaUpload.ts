"use client";

import {
  useEffect,
  useState,
} from "react";

import { adminFetch } from "@/app/components/admin/api";

import type {
  MediaUploadResponse,
} from "@/app/components/admin/types";

import {
  getUploadUrl,
} from "@/app/components/admin/utils";

export function useMediaUpload() {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [
    uploadedUrl,
    setUploadedUrl,
  ] = useState("");

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setPreview(
      url
    );

    return () => {
      URL.revokeObjectURL(
        url
      );
    };
  }, [file]);

  function selectFile(
    nextFile:
      File | null
  ) {
    setFile(
      nextFile
    );

    setError("");
    setMessage("");
    setUploadedUrl("");
  }

  async function upload() {
    if (!file) {
      setError(
        "Pilih gambar terlebih dahulu."
      );

      return;
    }

    try {
      setUploading(
        true
      );

      setError("");
      setMessage("");

      const formData =
        new FormData();

      /**
       * Harus "file"
       * karena backend memakai:
       *
       * upload.single("file")
       */
      formData.append(
        "file",
        file
      );

      const response =
        await adminFetch<MediaUploadResponse>(
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

      setUploadedUrl(
        url
      );

      setMessage(
        "Gambar berhasil diupload."
      );
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Upload gambar gagal."
      );
    } finally {
      setUploading(
        false
      );
    }
  }

  return {
    file,
    preview,
    uploadedUrl,
    uploading,
    error,
    message,

    selectFile,
    upload,
  };
}