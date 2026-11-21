import { Head, Link, useForm } from '@inertiajs/react';
import ThemeToggle from '../Components/ThemeToggle';

export default function AdminLogin() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/login');
    };

    const inputClass =
        'mt-1.5 block w-full rounded-md border border-paper-border bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent dark:border-slate-border dark:bg-slate-bg dark:text-slate-ink dark:placeholder:text-slate-muted/60 dark:focus:border-slate-accent';

    return (
        <>
            <Head title="Login Admin" />

            <div className="flex min-h-screen flex-col justify-between bg-paper px-4 py-8 text-ink transition-colors dark:bg-slate-bg dark:text-slate-ink">
                <div className="mx-auto flex w-full max-w-md items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex min-h-[44px] items-center text-sm font-medium text-ink-muted hover:text-ink dark:text-slate-muted dark:hover:text-slate-ink"
                    >
                        Kembali ke CV
                    </Link>
                    <ThemeToggle />
                </div>

                <main className="mx-auto my-8 w-full max-w-md">
                    <div className="rounded-lg border border-paper-border bg-paper-card p-6 sm:p-8 dark:border-slate-border dark:bg-slate-card">
                        <h1 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                            Masuk Admin
                        </h1>
                        <p className="mt-1.5 text-sm text-ink-muted dark:text-slate-muted">
                            Masuk untuk mengelola konten profil dan daftar proyek.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-ink dark:text-slate-ink">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="admin@witarko.local"
                                    className={inputClass}
                                />
                                {form.errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                        {form.errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-ink dark:text-slate-ink">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className={inputClass}
                                />
                                {form.errors.password && (
                                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                        {form.errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(e) => form.setData('remember', e.target.checked)}
                                    className="h-4 w-4 accent-accent dark:accent-slate-accent"
                                />
                                <label htmlFor="remember" className="text-sm text-ink-muted dark:text-slate-muted">
                                    Ingat sesi saya
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                            >
                                {form.processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>
                    </div>
                </main>

                <div className="mx-auto w-full max-w-md text-center text-xs text-ink-muted dark:text-slate-muted">
                    Witarko · Halaman Administrasi
                </div>
            </div>
        </>
    );
}
