"use client";

import Link from "next/link";
import NextImage from "next/image";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  LayoutDashboard,
  Clock3,
  Image as ImageIcon,
  Folder,
  Globe2,
  MessageCircle,
  Users,
  Settings,
  UserCircle2,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  useAdminSession,
} from "@/app/hooks/admin/useAdminSession";

import styles from "@/app/styles/admin/AdminShell.module.css";

const content = [
  "home",
  "solutions",
  "about",
  "service",
  "portfolio",
  "testimonial",
  "faq",
  "team",
  "partners",
  "contact",
];

const labels: Record<
  string,
  string
> = {
  home: "Home",
  solutions: "Solutions",
  about: "About",
  service: "Service",
  portfolio: "Portfolio",
  testimonial: "Testimonial",
  faq: "FAQ",
  team: "Team",
  partners: "Partners",
  contact: "Contact",
};

export default function AdminShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const pathname =
    usePathname();

  const [
    contentOpen,
    setContentOpen,
  ] =
    useState(true);

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false);

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

  useEffect(() => {
    const closeProfile = (
      event:
        MouseEvent
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

  const nav = (
    href:
      string,
    label:
      string,
    Icon:
      any
  ) => {
    const active =
      pathname ===
        p(href) ||
      pathname.startsWith(
        p(href) + "/"
      );

    return (
      <Link
        href={
          p(href)
        }
        className={`${styles.navLink} ${
          active
            ? styles.active
            : ""
        }`}
      >
        <Icon
          size={20}
          strokeWidth={
            1.9
          }
        />

        <span>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div
      className={
        styles.shell
      }
    >

      {/* ================= SIDEBAR ================= */}

      <aside
        className={
          styles.sidebar
        }
      >

        {/* ================= LOGO ================= */}

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

        {/* ================= NAVIGATION ================= */}

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
            >
              <span>
                <Clock3
                  size={20}
                  strokeWidth={
                    1.9
                  }
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
                {content.map(
                  (
                    item
                  ) => {
                    const href =
                      p(
                        `/admin/content/${item}`
                      );

                    const active =
                      pathname.startsWith(
                        href
                      );

                    return (
                      <Link
                        key={
                          item
                        }
                        href={
                          href
                        }
                        className={
                          active
                            ? styles.subActive
                            : ""
                        }
                      >
                        {
                          labels[
                            item
                          ]
                        }
                      </Link>
                    );
                  }
                )}
              </div>
            )}

            {nav(
              "/admin/media",
              "Media",
              ImageIcon
            )}

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

        {/* ================= PROFILE ================= */}

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
                  size={
                    17
                  }
                />

                Logout
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
            />
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

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