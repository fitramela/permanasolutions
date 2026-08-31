import type { MediaUploadResponse } from "./types";

export function getData<T = any>(response: any): T {
  return (response?.data ?? response) as T;
}

export function getArray<T = any>(response: any): T[] {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.pages)) return data.pages;
  return [];
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getUploadUrl(response: MediaUploadResponse) {
  return (
    response?.data?.url ??
    response?.data?.image_url ??
    response?.data?.secure_url ??
    response?.url ??
    response?.image_url ??
    response?.secure_url ??
    ""
  );
}
