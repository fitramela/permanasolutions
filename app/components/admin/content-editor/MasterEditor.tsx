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

import {
  adminFetch,
} from "../api";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";
import tableStyles from "@/app/styles/admin/AdminTable.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
  ...tableStyles,
};
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

  /**
   * Dipakai untuk Products.
   *
   * ASP:
   * serviceFilter = "asp"
   */
  serviceFilter?: string;
};

/**
 * =========================================================
 * PAIR KEY
 * =========================================================
 *
 * Pair Indonesia + English.
 */
function itemPairKey(
  item: MasterItem,
  type: MasterType
) {
  /**
   * Prioritas translation_key
   * kalau database sudah memiliki.
   */
  if (
    item.translation_key
  ) {
    return String(
      item.translation_key
    );
  }

  /**
   * Products menggunakan slug.
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
   * Fallback:
   * sort_order.
   */
  return String(
    item.sort_order ?? ""
  );
}

/**
 * =========================================================
 * SERVICE MATCH
 * =========================================================
 */
function matchesService(
  item: MasterItem,
  serviceFilter?: string
) {
  if (!serviceFilter) {
    return true;
  }

  return (
    String(
      item.service ?? ""
    )
      .trim()
      .toLowerCase() ===
    serviceFilter
      .trim()
      .toLowerCase()
  );
}

export default function MasterEditor({
  type,
  locale,
  serviceFilter,
}: Props) {
  const [
    indonesiaItems,
    setIndonesiaItems,
  ] =
    useState<MasterItem[]>(
      []
    );

  const [
    englishItems,
    setEnglishItems,
  ] =
    useState<MasterItem[]>(
      []
    );

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
          setLoading(
            true
          );

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
          setIndonesiaItems(
            []
          );

          setEnglishItems(
            []
          );

          setError(
            error instanceof
              Error
              ? error.message
              : "Gagal mengambil data."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        type,
      ]
    );

  useEffect(() => {
    load();
  }, [
    load,
  ]);

  /**
   * =========================================================
   * FILTERED ITEMS
   * =========================================================
   *
   * ASP hanya menampilkan:
   *
   * service = "asp"
   *
   * Clients / Technologies / Team
   * tidak terkena filter ini.
   */
  const filteredIndonesiaItems =
    useMemo(() => {
      if (
        type !==
          "products" ||
        !serviceFilter
      ) {
        return indonesiaItems;
      }

      return indonesiaItems.filter(
        (
          item
        ) =>
          matchesService(
            item,
            serviceFilter
          )
      );
    }, [
      indonesiaItems,
      type,
      serviceFilter,
    ]);

  const filteredEnglishItems =
    useMemo(() => {
      if (
        type !==
          "products" ||
        !serviceFilter
      ) {
        return englishItems;
      }

      return englishItems.filter(
        (
          item
        ) =>
          matchesService(
            item,
            serviceFilter
          )
      );
    }, [
      englishItems,
      type,
      serviceFilter,
    ]);

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
          ? filteredIndonesiaItems
          : filteredEnglishItems,
      [
        locale,
        filteredIndonesiaItems,
        filteredEnglishItems,
      ]
    );

  /**
   * =========================================================
   * FIND TRANSLATION PARTNER
   * =========================================================
   */
  function findPartner(
    item: MasterItem,
    targetItems:
      MasterItem[]
  ) {
    const key =
      itemPairKey(
        item,
        type
      );

    return targetItems.find(
      (
        target
      ) =>
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
    /**
     * Khusus ASP, urutan cukup
     * dihitung dari Products ASP.
     *
     * Bukan semua products.
     */
    const orderIndonesia =
      type ===
        "products" &&
      serviceFilter
        ? filteredIndonesiaItems
        : indonesiaItems;

    const orderEnglish =
      type ===
        "products" &&
      serviceFilter
        ? filteredEnglishItems
        : englishItems;

    const maxOrder =
      Math.max(
        -1,

        ...orderIndonesia.map(
          (
            item
          ) =>
            Number(
              item.sort_order ??
              0
            )
        ),

        ...orderEnglish.map(
          (
            item
          ) =>
            Number(
              item.sort_order ??
              0
            )
        )
      );

    const nextOrder =
      maxOrder + 1;

    const productService =
      type ===
        "products" &&
      serviceFilter
        ? {
            service:
              serviceFilter,
          }
        : {};

    setIdForm({
      ...emptyMasterForm(
        type,
        "id"
      ),

      ...productService,

      sort_order:
        nextOrder,
    });

    setEnForm({
      ...emptyMasterForm(
        type,
        "en"
      ),

      ...productService,

      sort_order:
        nextOrder,
    });

    setModalTitle(
      `Tambah ${masterLabel(
        type
      )}`
    );

    setModalOpen(
      true
    );

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
      item.sort_order ??
      0;

    const productService =
      type ===
        "products" &&
      serviceFilter
        ? {
            service:
              serviceFilter,
          }
        : {};

    setIdForm({
      ...emptyMasterForm(
        type,
        "id"
      ),

      ...(indonesia ??
        {}),

      ...productService,

      locale:
        "id",

      sort_order:
        indonesia?.sort_order ??
        sharedSortOrder,
    });

    setEnForm({
      ...emptyMasterForm(
        type,
        "en"
      ),

      ...(english ??
        {}),

      ...productService,

      locale:
        "en",

      sort_order:
        english?.sort_order ??
        sharedSortOrder,
    });

    setModalTitle(
      `Edit ${
        item.name ??
        masterLabel(
          type
        )
      }`
    );

    setModalOpen(
      true
    );

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
    targetLocale:
      Locale
  ) {
    /**
     * Service dipaksa sesuai
     * halaman admin.
     *
     * Contoh ASP:
     * service = "asp"
     */
    const payload = {
      ...item,

      ...(type ===
        "products" &&
      serviceFilter
        ? {
            service:
              serviceFilter,
          }
        : {}),

      locale:
        targetLocale,
    };

    /**
     * Existing item.
     */
    if (
      item.id !==
        undefined &&
      item.id !== null
    ) {
      await adminFetch(
        `/cms/master/${type}/${item.id}`,
        {
          method:
            "PUT",

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
        method:
          "POST",

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
    indonesia:
      MasterItem,
    english:
      MasterItem
  ) {
    try {
      setSaving(
        true
      );

      setError("");
      setMessage("");

      if (
        !String(
          indonesia.name ??
          ""
        ).trim()
      ) {
        throw new Error(
          "Nama Indonesia wajib diisi."
        );
      }

      if (
        !String(
          english.name ??
          ""
        ).trim()
      ) {
        throw new Error(
          "Nama English wajib diisi."
        );
      }

      /**
       * Indonesia + English
       * harus mempunyai urutan sama.
       */
      const pairOrder =
        indonesia.sort_order ??
        english.sort_order ??
        0;

      const productService =
        type ===
          "products" &&
        serviceFilter
          ? {
              service:
                serviceFilter,
            }
          : {};

      await Promise.all([
        saveOne(
          {
            ...indonesia,

            ...productService,

            sort_order:
              pairOrder,
          },
          "id"
        ),

        saveOne(
          {
            ...english,

            ...productService,

            sort_order:
              pairOrder,
          },
          "en"
        ),
      ]);

      setModalOpen(
        false
      );

      setMessage(
        "Data berhasil disimpan."
      );

      await load();
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Gagal menyimpan data."
      );

      throw error;
    } finally {
      setSaving(
        false
      );
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
        Promise<any>[] =
        [];

      if (
        indonesia?.id !==
          undefined &&
        indonesia?.id !==
          null
      ) {
        requests.push(
          adminFetch(
            `/cms/master/${type}/${indonesia.id}`,
            {
              method:
                "DELETE",
            }
          )
        );
      }

      if (
        english?.id !==
          undefined &&
        english?.id !==
          null
      ) {
        requests.push(
          adminFetch(
            `/cms/master/${type}/${english.id}`,
            {
              method:
                "DELETE",
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
        error instanceof
          Error
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

          {type ===
            "products" &&
            serviceFilter && (
              <p>
                Menampilkan produk
                untuk service{" "}
                <strong>
                  {
                    serviceFilter.toUpperCase()
                  }
                </strong>
                .
              </p>
            )}
        </div>

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
              visibleItems.map(
                (
                  item
                ) => (
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

                    {/* ACTION */}

                    <td>
                      <div
                        className={
                          styles.tableActions
                        }
                      >
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
        open={modalOpen}
        type={type}
        title={modalTitle}
        indonesia={idForm}
        english={enForm}
        saving={saving}
        serviceFilter={serviceFilter}
        onClose={() =>
          setModalOpen(
            false
          )
        }
        onSave={saveBoth}
      />
    </section>
  );
}