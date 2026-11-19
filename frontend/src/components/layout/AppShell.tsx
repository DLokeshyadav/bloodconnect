import clsx from 'clsx';
import { Menu, X } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { Button, Panel, StateView } from '../ui';
import { navigation, pageTitleFor } from './navigation';
import { homePathFor } from '../../lib/roles';
import { ChatWidget } from '../chat/ChatWidget';
import { BackButton } from './BackButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';

/**
 * Layout for every signed-in BloodConnect page:
 * 240px sidebar with the role's links, top bar with page title and actions, content on the page background.
 * Below 1024px the sidebar becomes a slide-out menu.
 */
export function AppShell() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  if (!user) return null; // RequireAuth guarantees a user; this keeps TypeScript happy

  const titleKey = pageTitleFor(pathname, user.role);
  const title = titleKey ? t(`nav.${titleKey}`) : 'BloodConnect';

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[240px_1fr]">
      {/* First thing a keyboard user reaches: jump past the sidebar and top bar */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-label font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t('nav.skipToContent')}
      </a>
      {/* Dimmed backdrop behind the mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" aria-hidden="true" onClick={() => setMenuOpen(false)} />
      )}

      <aside
        id="app-sidebar"
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface transition-transform duration-200',
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link
            to="/"
            aria-label={t('common.homeLink')}
            onClick={() => setMenuOpen(false)}
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
                <linearGradient id="bc-shell-drop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D62828" />
                  <stop offset="100%" stopColor="#A4161A" />
                </linearGradient>
              </defs>
              <path
                d="M16 2.5C13.6 6.8 6.5 13.3 6.5 20.2C6.5 25.5 10.75 29.75 16 29.75C21.25 29.75 25.5 25.5 25.5 20.2C25.5 13.3 18.4 6.8 16 2.5Z"
                fill="url(#bc-shell-drop)"
              />
              <rect x="14.2" y="14.5" width="3.6" height="10.4" rx="1.2" fill="#FFFFFF" />
              <rect x="10.8" y="17.9" width="10.4" height="3.6" rx="1.2" fill="#FFFFFF" />
            </svg>
            <span className="font-display text-wordmark font-bold tracking-tight text-ink">
              Blood<span className="text-primary">Connect</span>
            </span>
          </Link>
          <Button variant="icon" aria-label={t('nav.closeMenu')} className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <X size={18} aria-hidden="true" />
          </Button>
        </div>

        <nav aria-label={t('nav.main')} className="flex flex-col gap-1 px-3 py-3">
          {navigation[user.role].map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex h-10 items-center gap-3 rounded-md px-3 text-body font-medium no-underline',
                  'focus-visible:shadow-focus focus-visible:outline-none',
                  isActive
                    ? 'bg-primary-soft text-primary-hover hover:text-primary-hover'
                    : 'text-text-muted hover:bg-bg hover:text-ink',
                )
              }
            >
              <Icon size={18} aria-hidden="true" />
              {t(`nav.${label}`)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-8">
          <Button
            variant="icon"
            aria-label={t('nav.openMenu')}
            aria-controls="app-sidebar"
            aria-expanded={menuOpen}
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} aria-hidden="true" />
          </Button>

          {/* Back to the previous page; with none in this tab, a page goes to its dashboard and a dashboard to the home page */}
          <BackButton fallback={pathname === homePathFor(user.role) ? '/' : homePathFor(user.role)} />

          <h1 className="min-w-0 flex-1 truncate text-title-md text-ink">{title}</h1>

          <LanguageSwitcher />
          <NotificationBell />
          <UserMenu />
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1312px] flex-1 px-4 pt-6 pb-24 focus:outline-none sm:px-8 lg:pt-8">
          {/* While a page downloads the first time, the sidebar and top bar stay and only this area waits */}
          <Suspense
            fallback={
              <Panel>
                <StateView state="loading" rows={4} />
              </Panel>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}