"use client";

import {
  ListFilter,
  Plus,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";
import tableStyles from "@/app/styles/admin/AdminTable.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
  ...tableStyles,
};

export default function EmptyTablePage({
  title,
  description,
  columns,
}: {
  title: string;
  description: string;
  columns: string[];
}) {
  return (
    <>
      {/* HEADER */}

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1
            className={
              styles.pageTitle
            }
          >
            {title}
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            {description}
          </p>
        </div>

        <button
          type="button"
          className={
            styles.addIconButton
          }
          aria-label="Tambah data"
          title="Tambah data"
        >
          <Plus
            size={19}
          />
        </button>
      </div>

      {/* TABLE CARD */}

      <section
        className={
          styles.card
        }
      >
        <div
          className={
            styles.tableToolbar
          }
        >
          <input
            className={
              styles.search
            }
            placeholder={`Cari ${title.toLowerCase()}...`}
          />

          <button
            type="button"
            className={
              styles.iconButton
            }
            aria-label="Filter status"
            title="Filter status"
          >
            <ListFilter
              size={18}
            />
          </button>
        </div>

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
                  No
                </th>

                {columns.map(
                  (
                    column
                  ) => (
                    <th
                      key={
                        column
                      }
                    >
                      {column}
                    </th>
                  )
                )}

                <th>
                  Status
                </th>

                <th>
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                className={
                  styles.emptyRow
                }
              >
                <td
                  colSpan={
                    columns.length +
                    3
                  }
                >
                  Belum ada data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}