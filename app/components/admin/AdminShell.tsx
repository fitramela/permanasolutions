"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./AdminShell.module.css";

type MenuItem = { label: string; href: string; icon: string };
type MenuGroup = { title?: string; items: MenuItem[] };

const menuGroups: MenuGroup[] = [
  { items: [{ label: "Dashboard", href: "/admin", icon: "⌂" }] },
  {
    title: "Konten Website",
    items: [
      { label: "Beranda", href: "/admin/pages/home", icon: "▣" },
      { label: "Solusi", href: "/admin/pages/solutions", icon: "◇" },
      { label: "Tentang Kami", href: "/admin/pages/about", icon: "◎" },
      { label: "Kontak", href: "/admin/pages/contact", icon: "✉" },
    ],
  },
  {
    title: "Layanan",
    items: [
      { label: "ASP", href: "/admin/services/asp", icon: "◉" },
      { label: "ISP", href: "/admin/services/isp", icon: "⌁" },
      { label: "Consulting & Resource", href: "/admin/services/resource", icon: "◇" },
    ],
  },
  {
    title: "Data Master",
    items: [
      { label: "Produk", href: "/admin/master/products", icon: "□" },
      { label: "Klien", href: "/admin/master/clients", icon: "♧" },
      { label: "Teknologi / Library", href: "/admin/master/technologies", icon: "</>" },
      { label: "Anggota Tim", href: "/admin/master/team", icon: "♙" },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { label: "Pesan Masuk", href: "/admin/messages", icon: "✉" },
      { label: "Media Library", href: "/admin/media", icon: "▧" },
      { label: "Pengaturan", href: "/admin/settings", icon: "⚙" },
    ],
  },
];

export default function AdminShell({ children, locale }: { children: ReactNode; locale: string }) {
  const pathname = usePathname();
  const withLocale = (href: string) => `/${locale}${href}`;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div className={styles.logoText}>
            <strong>PERMANA</strong>
            <span>SOLUTIONS</span>
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Navigasi admin">
          {menuGroups.map((group, groupIndex) => (
            <div className={styles.menuGroup} key={`${group.title ?? "main"}-${groupIndex}`}>
              {group.title && <p className={styles.groupTitle}>{group.title}</p>}
              <div className={styles.menuItems}>
                {group.items.map((item) => {
                  const href = withLocale(item.href);
                  const isDashboard = item.href === "/admin";
                  const active = isDashboard ? pathname === href : pathname.startsWith(href);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={`${styles.navLink} ${active ? styles.active : ""}`}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.profile}>
            <div className={styles.avatar}>A</div>
            <div className={styles.profileText}>
              <strong>Admin</strong>
              <small>Super Admin</small>
            </div>
          </div>
          <button className={styles.languageButton} type="button">Indonesia ▾</button>
        </header>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
