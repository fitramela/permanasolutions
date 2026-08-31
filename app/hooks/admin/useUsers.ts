"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { adminFetch } from "@/app/components/admin/api";
import type {
  AnyObject,
  UserForm,
  UserItem,
} from "@/app/components/admin/types";
import { getArray } from "@/app/components/admin/utils";

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
  active_status: true,
};

export function useUsers() {
  const [items, setItems] =
    useState<UserItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<UserItem | null>(null);

  const [form, setForm] =
    useState<UserForm>(emptyForm);

  const loadUsers =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await adminFetch<any>(
            "/users"
          );

        setItems(
          getArray<UserItem>(
            response
          )
        );
      } catch (error) {
        setItems([]);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data user."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function openEdit(
    user: UserItem
  ) {
    setEditingUser(user);

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      active_status:
        !!user.active_status,
    });

    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingUser(null);
  }

  function updateForm<
    K extends keyof UserForm
  >(
    key: K,
    value: UserForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function saveUser() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.name.trim()) {
        setError(
          "Nama wajib diisi."
        );
        return;
      }

      if (!form.email.trim()) {
        setError(
          "Email wajib diisi."
        );
        return;
      }

      if (
        !editingUser &&
        !form.password.trim()
      ) {
        setError(
          "Password wajib diisi untuk user baru."
        );
        return;
      }

      if (editingUser?.id) {
        const payload: AnyObject = {
          name: form.name,
          email: form.email,
          active_status:
            form.active_status,
        };

        if (
          form.password.trim()
        ) {
          payload.password =
            form.password;
        }

        await adminFetch(
          `/users/${editingUser.id}`,
          {
            method: "PUT",
            body: JSON.stringify(
              payload
            ),
          }
        );

        setMessage(
          "User berhasil diperbarui."
        );
      } else {
        await adminFetch(
          "/users",
          {
            method: "POST",
            body: JSON.stringify(
              form
            ),
          }
        );

        setMessage(
          "Admin baru berhasil ditambahkan."
        );
      }

      setModalOpen(false);
      setEditingUser(null);

      await loadUsers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan user."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(
    user: UserItem
  ) {
    if (!user.id) return;

    const confirmed =
      window.confirm(
        `Hapus user "${user.name ?? user.email}"?`
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await adminFetch(
        `/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "User berhasil dihapus."
      );

      await loadUsers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus user."
      );
    }
  }

  async function reset2FA(
    user: UserItem
  ) {
    if (!user.id) return;

    const confirmed =
      window.confirm(
        `Reset 2FA untuk "${user.name ?? user.email}"?`
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response =
        await adminFetch<any>(
          `/users/${user.id}/reset-2fa`,
          {
            method: "POST",
          }
        );

      setMessage(
        response?.message ??
          "2FA berhasil di-reset."
      );

      await loadUsers();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal reset 2FA."
      );
    }
  }

  return {
    items,
    loading,
    saving,
    error,
    message,

    modalOpen,
    editingUser,
    form,

    openCreate,
    openEdit,
    closeModal,
    updateForm,

    saveUser,
    deleteUser,
    reset2FA,

    refetch: loadUsers,
  };
}