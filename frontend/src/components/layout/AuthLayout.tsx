import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BackButton } from './BackButton';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Sign-in and registration: a 640px dark hero on the left and the form column on the right.
 * Below 1024px the hero is hidden and a slim BloodConnect logo header sits above the form instead.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[640px_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Link
          to="/"
          aria-label={t('common.homeLink')}
          className="relative inline-flex items-center gap-2.5 self-start text-white no-underline hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="30"
            height="30"
            aria-hidden="true"
            className="shrink-0"
          >
            <defs>
              <linearGradient id="bc-auth-dark-drop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D62828" />
                <stop offset="100%" stopColor="#A4161A" />
              </linearGradient>
            </defs>
            <path
              d="M16 2.5C13.6 6.8 6.5 13.3 6.5 20.2C6.5 25.5 10.75 29.75 16 29.75C21.25 29.75 25.5 25.5 25.5 20.2C25.5 13.3 18.4 6.8 16 2.5Z"
              fill="url(#bc-auth-dark-drop)"
            />
            <rect x="14.2" y="14.5" width="3.6" height="10.4" rx="1.2" fill="#FFFFFF" />
            <rect x="10.8" y="17.9" width="10.4" height="3.6" rx="1.2" fill="#FFFFFF" />
          </svg>
          <span className="font-display text-wordmark font-bold tracking-tight text-white">
            Blood<span className="text-primary-on-dark">Connect</span>
          </span>
        </Link>

        <div className="relative flex max-w-[440px] flex-col gap-4">
          <h2 className="font-display text-display-xl">{t('auth.heroTitle')}</h2>
          <p className="text-body-lg text-on-dark-muted">{t('auth.heroBody')}</p>
        </div>

        <p className="relative flex items-center gap-2 text-label text-on-dark-muted">
          <ShieldCheck size={18} strokeWidth={1.75} className="text-primary-on-dark" aria-hidden="true" />
          {t('auth.heroTrust')}
        </p>

        {/* Large blood drop bleeding off the bottom-right corner */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-40 h-[520px] w-[520px] fill-dark-2"
        >
          <path d="M12 2.5c-.3 0-.6.2-.8.4C9.6 5 5 11 5 14.8 5 18.8 8.1 22 12 22s7-3.2 7-7.2C19 11 14.4 5 12.8 2.9c-.2-.2-.5-.4-.8-.4Z" />
        </svg>
      </aside>

      <main className="flex items-center justify-center bg-bg px-4 py-10 sm:px-8">
        <div className="flex w-full max-w-[400px] flex-col gap-8">
          <div className="-mb-4 flex items-center gap-2">
            <BackButton fallback="/" className="-ml-2.5" />
            <Link
              to="/"
              aria-label={t('common.homeLink')}
              className="inline-flex items-center gap-2 text-ink no-underline hover:text-ink lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="26"
                height="26"
                aria-hidden="true"
                className="shrink-0"
              >
                <defs>
                  <linearGradient id="bc-auth-light-drop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D62828" />
                    <stop offset="100%" stopColor="#A4161A" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 2.5C13.6 6.8 6.5 13.3 6.5 20.2C6.5 25.5 10.75 29.75 16 29.75C21.25 29.75 25.5 25.5 25.5 20.2C25.5 13.3 18.4 6.8 16 2.5Z"
                  fill="url(#bc-auth-light-drop)"
                />
                <rect x="14.2" y="14.5" width="3.6" height="10.4" rx="1.2" fill="#FFFFFF" />
                <rect x="10.8" y="17.9" width="10.4" height="3.6" rx="1.2" fill="#FFFFFF" />
              </svg>
              <span className="font-display text-title-lg font-bold tracking-tight text-ink">
                Blood<span className="text-primary">Connect</span>
              </span>
            </Link>
            <LanguageSwitcher className="ml-auto" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}