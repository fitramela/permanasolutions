"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export function useAdminSession(locale: string) {
  const router = useRouter();

  const [userName, setUserName] =
    useState("Admin");

  useEffect(() => {
    try {
      const rawUser =
        localStorage.getItem("authUser");

      if (!rawUser) return;

      const user = JSON.parse(rawUser) as {
        name?: string;
        email?: string;
      };

      setUserName(
        user.name ||
          user.email ||
          "Admin"
      );
    } catch {
      setUserName("Admin");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    sessionStorage.removeItem(
      "twoFactorUserId"
    );

    sessionStorage.removeItem(
      "twoFactorEmail"
    );

    router.replace(`/${locale}/login`);
  }, [locale, router]);

  return {
    userName,
    logout,
  };
}