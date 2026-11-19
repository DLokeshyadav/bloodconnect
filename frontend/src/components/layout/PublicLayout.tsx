import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BackButton } from './BackButton';
import { LanguageSwitcher } from './LanguageSwitcher';

// Simple centred layout for pages outside the app shell (forgot password, 404), with a back arrow
export function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 text-ink">
      <div className="flex w-full max-w-[440px] flex-col gap-6">
        <div className="relative flex items-center justify-center">
          <BackButton fallback="/" className="absolute left-0" />
          <Link
            to="/"
            aria-label={t('common.homeLink')}
            className="inline-flex items-center gap-2.5 text-ink no-underline hover:text-ink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              aria-hidden="true"
              className="shrink-0"
            >
              <defs>
                <linearGradient id="bc-public-drop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D62828" />
                  <stop offset="100%" stopColor="#A4161A" />
                </linearGradient>
              </defs>
              <path
                d="M16 2.5C13.6 6.8 6.5 13.3 6.5 20.2C6.5 25.5 10.75 29.75 16 29.75C21.25 29.75 25.5 25.5 25.5 20.2C25.5 13.3 18.4 6.8 16 2.5Z"
                fill="url(#bc-public-drop)"
              />
              <rect x="14.2" y="14.5" width="3.6" height="10.4" rx="1.2" fill="#FFFFFF" />
              <rect x="10.8" y="17.9" width="10.4" height="3.6" rx="1.2" fill="#FFFFFF" />
            </svg>
            <span className="font-display text-wordmark font-bold tracking-tight text-ink">
              Blood<span className="text-primary">Connect</span>
            </span>
          </Link>
          <LanguageSwitcher className="absolute right-0" />
        </div>
        {children}
      </div>
    </div>
  );
}