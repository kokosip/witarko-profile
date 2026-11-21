import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch (e) {}
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-paper-border bg-paper-card px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30 dark:border-slate-border dark:bg-slate-card dark:text-slate-ink dark:hover:border-slate-ink/30"
        >
            {isDark ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
            <span className="hidden sm:inline">{isDark ? 'Terang' : 'Gelap'}</span>
        </button>
    );
}
