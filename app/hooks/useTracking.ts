'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function generateId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
}

export function useTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        'NEXT_PUBLIC_API_URL belum dikonfigurasi di .env.local',
      );
      return;
    }

    const queryString = searchParams?.toString();

    const currentPath =
      pathname + (queryString ? `?${queryString}` : '');

    if (previousPath.current === currentPath) return;

    previousPath.current = currentPath;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const token = localStorage.getItem('token');

    const trackingUrl = `${apiUrl}/track`;

    const sendTracking = async () => {
      try {
        const response = await fetch(trackingUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            visitorId,
            sessionId,
            path: currentPath,
            locale: document.documentElement.lang || 'id',
            referrer: document.referrer || '',
          }),
          keepalive: true,
        });

        const responseText = await response.text();

        if (!response.ok) {
          console.error('Tracking API error:', {
            url: trackingUrl,
            status: response.status,
            statusText: response.statusText,
            response: responseText,
          });

          return;
        }

        console.log('Tracking berhasil:', {
          path: currentPath,
          status: response.status,
        });
      } catch (error) {
        console.error('Gagal menghubungi Tracking API:', error);
      }
    };

    void sendTracking();
  }, [pathname, searchParams]);
}