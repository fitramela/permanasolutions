"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { adminFetch } from "../api";

import styles from "@/app/styles/admin/AdminUI.module.css";

import EditMasterModal from "./EditMasterModal";

import {
  emptyMasterForm,
  masterLabel,
} from "./helpers";

import type {
  Locale,
  MasterItem,
  MasterType,
} from "./types";

type Props = {
  type: MasterType;
  locale: Locale;
};

function itemPairKey(
  item: MasterItem,
  type: MasterType
) {
  /**
   * Prioritas translation_key
   * kalau nanti DB sudah punya.
   */
  if (item.translation_key) {
    return String(
      item.translation_key
    );
  }

  /**
   * Products memakai slug.
   */
  if (
    type === "products" &&
    item.slug
  ) {
    return String(
      item.slug
    );
  }

  /**
   * Fallback pairing sekarang
   * menggunakan sort_order.
   */
  return String(
    item.sort_order ?? ""
  );
}

export default function MasterEditor({
  type,
  locale,
}: Props) {
  const [
    indonesiaItems,
    setIndonesiaItems,
  ] =
    useState<MasterItem[]>([]);

  const [
    englishItems,
    setEnglishItems,
  ] =
    useState<MasterItem[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    modalTitle,
    setModalTitle,
  ] =
    useState("");

  const [
    idForm,
    setIdForm,
  ] =
    useState<MasterItem>(
      emptyMasterForm(
        type,
        "id"
      )
    );

  const [
    enForm,
    setEnForm,
  ] =
    useState<MasterItem>(
      emptyMasterForm(
        type,
        "en"
      )
    );

  /**
   * =========================================================
   * LOAD INDONESIA + ENGLISH
   * =========================================================
   */

  const load =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            indonesia,
            english,
          ] =
            await Promise.all([
              adminFetch<any>(
                `/cms/master/${type}?locale=id`
              ),

              adminFetch<any>(
                `/cms/master/${type}?locale=en`
              ),
            ]);

          setIndonesiaItems(
            Array.isArray(
              indonesia?.data
            )
              ? indonesia.data
              : []
          );

          setEnglishItems(
            Array.isArray(
              english?.data
            )
              ? english.data
              : []
          );
        } catch (error) {
          setIndonesiaItems([]);
          setEnglishItems([]);

          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil data."
          );
        } finally {
          setLoading(false);
        }
      },
      [type]
    );

  useEffect(() => {
    load();
  }, [load]);

  /**
   * =========================================================
   * DATA YANG DITAMPILKAN
   * =========================================================
   *
   * Tabel mengikuti dropdown bahasa.
   */

  const visibleItems =
    useMemo(
      () =>
        locale === "id"
          ? indonesiaItems
          : englishItems,
      [
        locale,
        indonesiaItems,
        englishItems,
      ]
    );

  /**
   * =========================================================
   * FIND TRANSLATION PARTNER
   * =========================================================
   */

  function findPartner(
    item: MasterItem,
    targetItems: MasterItem[]
  ) {
    const key =
      itemPairKey(
        item,
        type
      );

    return targetItems.find(
      (target) =>
        itemPairKey(
          target,
          type
        ) === key
    );
  }

  /**
   * =========================================================
   * ADD
   * =========================================================
   */

  function addNew() {
    const maxOrder =
      Math.max(
        -1,

        ...indonesiaItems.map(
          (item) =>
            Number(
              item.sort_order ?? 0
            )
        ),

        ...englishItems.map(
          (item) =>
            Number(
              item.sort_order ?? 0
            )
        )
      );

    const nextOrder =
      maxOrder + 1;

    setIdForm({
      ...emptyMasterForm(
        type,
        "id"
      ),

      sort_order:
        nextOrder,
    });

    setEnForm({
      ...emptyMasterForm(
        type,
        "en"
      ),

      sort_order:
        nextOrder,
    });

    setModalTitle(
      `Tambah ${masterLabel(
        type
      )}`
    );

    setModalOpen(true);

    setError("");
    setMessage("");
  }

  /**
   * =========================================================
   * EDIT
   * =========================================================
   */

  function edit(
    item: MasterItem
  ) {
    const indonesia =
      locale === "id"
        ? item
        : findPartner(
            item,
            indonesiaItems
          );

    const english =
      locale === "en"
        ? item
        : findPartner(
            item,
            englishItems
          );

    const sharedSortOrder =
      item.sort_order ?? 0;

    setIdForm({
      ...emptyMasterForm(
        type,
        "id"
      ),

      ...(indonesia ?? {}),

      locale: "id",

      sort_order:
        indonesia?.sort_order ??
        sharedSortOrder,
    });

    setEnForm({
      ...emptyMasterForm(
        type,
        "en"
      ),

      ...(english ?? {}),

      locale: "en",

      sort_order:
        english?.sort_order ??
        sharedSortOrder,
    });

    setModalTitle(
      `Edit ${
        item.name ??
        masterLabel(type)
      }`
    );

    setModalOpen(true);

    setError("");
    setMessage("");
  }

  /**
   * =========================================================
   * SAVE ONE LANGUAGE
   * =========================================================
   */

  async function saveOne(
    item: MasterItem,
    targetLocale: Locale
  ) {
    const payload = {
      ...item,
      locale:
        targetLocale,
    };

    /**
     * Existing item.
     */
    if (
      item.id !== undefined &&
      item.id !== null
    ) {
      await adminFetch(
        `/cms/master/${type}/${item.id}`,
        {
          method: "PUT",

          body:
            JSON.stringify(
              payload
            ),
        }
      );

      return;
    }

    /**
     * New item.
     */
    await adminFetch(
      `/cms/master/${type}`,
      {
        method: "POST",

        body:
          JSON.stringify(
            payload
          ),
      }
    );
  }

  /**
   * =========================================================
   * SAVE BOTH LANGUAGES
   * =========================================================
   */

  async function saveBoth(
    indonesia: MasterItem,
    english: MasterItem
  ) {
    try {
      setSaving(true);

      setError("");
      setMessage("");

      if (
        !String(
          indonesia.name ?? ""
        ).trim()
      ) {
        throw new Error(
          "Nama Indonesia wajib diisi."
        );
      }

      if (
        !String(
          english.name ?? ""
        ).trim()
      ) {
        throw new Error(
          "Nama English wajib diisi."
        );
      }

      /**
       * Indonesia dan English
       * harus tetap menjadi pasangan
       * dengan sort_order yang sama.
       */
      const pairOrder =
        indonesia.sort_order ??
        english.sort_order ??
        0;

      await Promise.all([
        saveOne(
          {
            ...indonesia,

            sort_order:
              pairOrder,
          },
          "id"
        ),

        saveOne(
          {
            ...english,

            sort_order:
              pairOrder,
          },
          "en"
        ),
      ]);

      setModalOpen(false);

      setMessage(
        "Data berhasil disimpan."
      );

      await load();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  /**
   * =========================================================
   * DELETE BOTH LANGUAGES
   * =========================================================
   */

  async function remove(
    item: MasterItem
  ) {
    const indonesia =
      locale === "id"
        ? item
        : findPartner(
            item,
            indonesiaItems
          );

    const english =
      locale === "en"
        ? item
        : findPartner(
            item,
            englishItems
          );

    const confirmed =
      window.confirm(
        `Hapus "${item.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const requests:
        Promise<any>[] = [];

      if (
        indonesia?.id !==
          undefined &&
        indonesia?.id !== null
      ) {
        requests.push(
          adminFetch(
            `/cms/master/${type}/${indonesia.id}`,
            {
              method: "DELETE",
            }
          )
        );
      }

      if (
        english?.id !==
          undefined &&
        english?.id !== null
      ) {
        requests.push(
          adminFetch(
            `/cms/master/${type}/${english.id}`,
            {
              method: "DELETE",
            }
          )
        );
      }

      await Promise.all(
        requests
      );

      setMessage(
        "Data berhasil dihapus."
      );

      await load();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus data."
      );
    }
  }

  return (
    <section
      className={
        styles.editorCard
      }
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className={
          styles.editorHeader
        }
      >
        <div>
          <h2>
            {masterLabel(
              type
            )}
          </h2>
        </div>

        {/* ADD ICON */}

        <button
          type="button"
          className={
            styles.addIconButton
          }
          onClick={
            addNew
          }
          aria-label="Tambah"
          title="Tambah"
        >
          <Plus
            size={21}
            strokeWidth={2.3}
          />
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className={
            styles.errorBox
          }
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {message && (
        <div
          className={
            styles.successBox
          }
        >
          {message}
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        className={`${styles.tableWrap} ${styles.hideScrollbar}`}
      >
        <table
          className={
            styles.table
          }
        >
          <thead>
            <tr>
              <th>
                Nama
              </th>

              <th>
                Info
              </th>

              <th>
                Status
              </th>

              <th>
                Urutan
              </th>

              <th>
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>

            {/* LOADING */}

            {loading ? (
              <tr
                className={
                  styles.emptyRow
                }
              >
                <td
                  colSpan={5}
                >
                  Memuat data...
                </td>
              </tr>
            ) : visibleItems.length ===
              0 ? (

              /* EMPTY */

              <tr
                className={
                  styles.emptyRow
                }
              >
                <td
                  colSpan={5}
                >
                  Belum ada data.
                </td>
              </tr>

            ) : (

              /* ITEMS */

              visibleItems.map(
                (item) => (
                  <tr
                    key={
                      String(
                        item.id
                      )
                    }
                  >

                    {/* NAME */}

                    <td>
                      <div
                        className={
                          styles.tablePrimary
                        }
                      >
                        {item.name}
                      </div>
                    </td>

                    {/* INFORMATION */}

                    <td>
                      <div
                        className={
                          styles.tableSecondary
                        }
                      >
                        {item.industry ??
                          item.position ??
                          item.category ??
                          item.service ??
                          "-"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={
                          styles.statusBadge
                        }
                      >
                        {item.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* SORT */}

                    <td>
                      {item.sort_order ??
                        0}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div
                        className={
                          styles.tableActions
                        }
                      >

                        {/* EDIT */}

                        <button
                          type="button"
                          className={
                            styles.iconEditButton
                          }
                          onClick={() =>
                            edit(
                              item
                            )
                          }
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Pencil
                            size={16}
                            strokeWidth={2}
                          />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className={
                            styles.iconDeleteButton
                          }
                          onClick={() =>
                            remove(
                              item
                            )
                          }
                          aria-label="Hapus"
                          title="Hapus"
                        >
                          <Trash2
                            size={16}
                            strokeWidth={2}
                          />
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>
        </table>
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      <EditMasterModal
        open={
          modalOpen
        }

        type={
          type
        }

        title={
          modalTitle
        }

        indonesia={
          idForm
        }

        english={
          enForm
        }

        saving={
          saving
        }

        onClose={() =>
          setModalOpen(
            false
          )
        }

        onSave={
          saveBoth
        }
      />

    </section>
  );
}