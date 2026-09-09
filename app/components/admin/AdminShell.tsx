"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  LayoutDashboard,
  Clock3,
  Folder,
  Globe2,
  MessageCircle,
  Users,
  Settings,
  UserCircle2,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useAdminSession } from "@/app/hooks/admin/useAdminSession";

import styles from "@/app/styles/admin/AdminShell.module.css";

/* =========================================================
   CONTENT
========================================================= */

const contentItems = [
  {
    key: "home",
    label: "Home",
  },
  {
    key: "solutions",
    label: "Solutions",
  },
  {
    key: "about",
    label: "About",
  },
  {
    key: "service",
    label: "Service",
  },
  {
    key: "team",
    label: "Team",
  },
  {
    key: "contact",
    label: "Contact",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const pathname = usePathname();

  const [
    contentOpen,
    setContentOpen,
  ] = useState(true);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const profileRef =
    useRef<HTMLDivElement>(
      null
    );

  const {
    userName,
    logout,
  } =
    useAdminSession(
      locale
    );

  const p = (
    href: string
  ) =>
    `/${locale}${href}`;

  /* =======================================================
     PROFILE OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const closeProfile = (
      event: MouseEvent
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      closeProfile
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeProfile
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE SIDEBAR AFTER NAVIGATION
  ======================================================= */

  useEffect(() => {
    setMobileMenuOpen(
      false
    );

    setProfileOpen(
      false
    );
  }, [pathname]);

  /* =======================================================
     LOCK BODY WHEN MOBILE SIDEBAR OPEN
  ======================================================= */

  useEffect(() => {
    if (
      !mobileMenuOpen
    ) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     CLOSE WITH ESC
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setMobileMenuOpen(
          false
        );

        setProfileOpen(
          false
        );
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* =======================================================
     MAIN NAV
  ======================================================= */

  const nav = (
    href: string,
    label: string,
    Icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
    }>
  ) => {
    const target =
      p(href);

    const active =
      pathname === target ||
      pathname.startsWith(
        `${target}/`
      );

    return (
      <Link
        href={target}
        className={`${styles.navLink} ${
          active
            ? styles.active
            : ""
        }`}
      >
        <Icon
          size={20}
          strokeWidth={1.9}
        />

        <span>
          {label}
        </span>
      </Link>
    );
  };

  /* =======================================================
     CONTENT LINK
  ======================================================= */

  const contentLink = (
    key: string,
    label: string
  ) => {
    const href =
      p(
        `/admin/content/${key}`
      );

    const active =
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      );

    return (
      <Link
        key={key}
        href={href}
        className={
          active
            ? styles.subActive
            : ""
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      className={
        styles.shell
      }
    >
      {/* ===================================================
          MOBILE HEADER
      =================================================== */}

      <header
        className={
          styles.mobileHeader
        }
      >
        {/* HAMBURGER */}

        <button
          type="button"
          className={
            styles.mobileMenuButton
          }
          onClick={() =>
            setMobileMenuOpen(
              true
            )
          }
          aria-label="Buka menu admin"
          title="Buka menu"
        >
          <Menu
            size={22}
            strokeWidth={2}
          />
        </button>

        {/* LOGO */}

        <Link
          href={p("/admin")}
          className={
            styles.mobileBrand
          }
          aria-label="Permana Solutions Admin"
        >
          <NextImage
            src="/images/logo.png"
            alt="Permana Solutions"
            width={170}
            height={60}
            priority
            className={
              styles.mobileLogo
            }
          />
        </Link>

        {/* SPACER KANAN
            Supaya logo benar-benar center */}

        <div
          className={
            styles.mobileHeaderSpacer
          }
          aria-hidden="true"
        />
      </header>

      {/* ===================================================
          MOBILE OVERLAY
      =================================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          className={
            styles.sidebarOverlay
          }
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
          aria-label="Tutup menu admin"
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen
            ? styles.sidebarOpen
            : ""
        }`}
      >
        {/* SIDEBAR TOP */}

        <div
          className={
            styles.sidebarTop
          }
        >
          {/* LOGO */}

          <Link
            href={
              p("/admin")
            }
            className={
              styles.brand
            }
            aria-label="Permana Solutions Admin"
          >
            <NextImage
              src="/images/logo.png"
              alt="Permana Solutions"
              width={240}
              height={90}
              priority
              className={
                styles.brandLogo
              }
            />
          </Link>

          {/* CLOSE MOBILE */}

          <button
            type="button"
            className={
              styles.mobileCloseButton
            }
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            aria-label="Tutup menu admin"
            title="Tutup menu"
          >
            <X
              size={22}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div
          className={
            styles.sidebarBody
          }
        >
          <nav
            className={
              styles.navigation
            }
          >
            {nav(
              "/admin",
              "Dashboard",
              LayoutDashboard
            )}

            {/* CONTENT */}

            <button
              type="button"
              className={
                styles.groupButton
              }
              onClick={() =>
                setContentOpen(
                  (
                    value
                  ) =>
                    !value
                )
              }
              aria-expanded={
                contentOpen
              }
            >
              <span>
                <Clock3
                  size={20}
                  strokeWidth={1.9}
                />

                <span>
                  Content
                </span>
              </span>

              <ChevronDown
                size={16}
                className={
                  contentOpen
                    ? styles.rotate
                    : ""
                }
              />
            </button>

            {contentOpen && (
              <div
                className={
                  styles.submenu
                }
              >
                {contentItems.map(
                  (
                    item
                  ) =>
                    contentLink(
                      item.key,
                      item.label
                    )
                )}
              </div>
            )}

            {/* OTHER */}

            {nav(
              "/admin/seo",
              "SEO",
              Folder
            )}

            {nav(
              "/admin/social-media",
              "Social Media",
              Globe2
            )}

            {nav(
              "/admin/messages",
              "Messages",
              MessageCircle
            )}

            {nav(
              "/admin/users",
              "Users",
              Users
            )}

            {nav(
              "/admin/settings",
              "Setting",
              Settings
            )}
          </nav>
        </div>

        {/* ===================================================
            PROFILE
        =================================================== */}

        <div
          className={
            styles.profileWrap
          }
          ref={
            profileRef
          }
        >
          {profileOpen && (
            <div
              className={
                styles.profileMenu
              }
            >
              <div
                className={
                  styles.profileInfo
                }
              >
                <strong>
                  {userName}
                </strong>

                <small>
                  Administrator
                </small>
              </div>

              <button
                type="button"
                onClick={
                  logout
                }
              >
                <LogOut
                  size={17}
                />

                <span>
                  Logout
                </span>
              </button>
            </div>
          )}

          <button
            type="button"
            className={
              styles.profileButton
            }
            onClick={() =>
              setProfileOpen(
                (
                  value
                ) =>
                  !value
              )
            }
            aria-expanded={
              profileOpen
            }
          >
            <UserCircle2
              size={25}
            />

            <div>
              <strong>
                {userName}
              </strong>

              <small>
                Administrator
              </small>
            </div>

            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? styles.rotate
                  : ""
              }
            />
          </button>
        </div>
      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main
        className={
          styles.main
        }
      >
        <div
          className={
            styles.content
          }
        >
          {children}
        </div>

        <footer
          className={
            styles.footer
          }
        >
          <span>
            © 2026 Permana Solutions. All rights reserved.
          </span>

          <span>
            v1.0.0
          </span>
        </footer>
      </main>
    </div>
  );
}