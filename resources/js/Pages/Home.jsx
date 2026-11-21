import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ThemeToggle from '../Components/ThemeToggle';

export default function Home({ profile, projects = [] }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const fullName = profile?.full_name || 'Witarko';
    const nickname = profile?.nickname || '';
    const headline = profile?.headline || '[REAL DATA] Software Engineer';
    const location = profile?.location || 'Yogyakarta, Indonesia';
    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
    const experiences = Array.isArray(profile?.experiences) ? profile.experiences : [];
    const educations = Array.isArray(profile?.educations) ? profile.educations : [];

    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

    const navItems = [
        { label: 'Ringkasan', href: '#ringkasan' },
        { label: 'Pengalaman', href: '#pengalaman' },
        { label: 'Proyek', href: '#proyek' },
        { label: 'Keahlian', href: '#keahlian' },
    ];

    return (
        <>
            <Head title={`${fullName} | CV & Portofolio`} />

            <div className="min-h-screen bg-paper text-ink transition-colors dark:bg-slate-bg dark:text-slate-ink">
                {/* Header Navigation */}
                <header className="sticky top-0 z-30 border-b border-paper-border bg-paper/95 backdrop-blur-sm print:hidden dark:border-slate-border dark:bg-slate-bg/95">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                        <a
                            href="#top"
                            className="inline-flex min-h-[44px] items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-ink dark:text-slate-ink"
                        >
                            <img
                                src="/images/logo.jpg"
                                alt=""
                                width={28}
                                height={28}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                            <span>{fullName}</span>
                        </a>

                        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink dark:text-slate-muted dark:hover:text-slate-ink"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-nav"
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-paper-border bg-paper-card px-3 py-2 text-sm font-medium text-ink md:hidden dark:border-slate-border dark:bg-slate-card dark:text-slate-ink"
                            >
                                <span>Menu</span>
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                                    {menuOpen ? (
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    ) : (
                                        <path d="M4 7h16M4 12h16M4 17h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {menuOpen && (
                        <nav
                            id="mobile-nav"
                            aria-label="Navigasi mobile"
                            className="border-t border-paper-border bg-paper px-4 py-3 md:hidden dark:border-slate-border dark:bg-slate-bg"
                        >
                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-paper-card dark:text-slate-ink dark:hover:bg-slate-card"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </nav>
                    )}
                </header>

                <main id="top" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
                    {/* Hero / Identity */}
                    <section className="reveal-section border-b border-paper-border pb-10 dark:border-slate-border">
                        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-sm font-medium text-accent dark:text-slate-accent">
                                    {location}
                                </p>
                                <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl dark:text-slate-ink">
                                    {fullName}
                                    {nickname && (
                                        <span className="ml-2.5 font-normal text-ink-muted dark:text-slate-muted">
                                            ({nickname})
                                        </span>
                                    )}
                                </h1>
                                <p className="mt-3 text-lg leading-relaxed text-ink-muted sm:text-xl dark:text-slate-muted">
                                    {headline}
                                </p>

                                {profile?.quote && (
                                    <blockquote className="mt-5 border-l-2 border-accent pl-4 text-sm italic leading-relaxed text-ink-muted dark:border-slate-accent dark:text-slate-muted">
                                        {profile.quote}
                                    </blockquote>
                                )}

                                <div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
                                    {profile?.github_url && (
                                        <a
                                            href={profile.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                        >
                                            <span>GitHub (@kokosip)</span>
                                        </a>
                                    )}

                                    {profile?.linkedin_url && (
                                        <a
                                            href={profile.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-paper-border bg-paper-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40 dark:border-slate-border dark:bg-slate-card dark:text-slate-ink dark:hover:border-slate-ink/40"
                                        >
                                            <span>LinkedIn</span>
                                        </a>
                                    )}

                                    {profile?.email && (
                                        <a
                                            href={`mailto:${profile.email}`}
                                            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-paper-border bg-paper-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40 dark:border-slate-border dark:bg-slate-card dark:text-slate-ink dark:hover:border-slate-ink/40"
                                        >
                                            <span>{profile.email}</span>
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-paper-border px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-ink/40 hover:text-ink dark:border-slate-border dark:text-slate-muted dark:hover:border-slate-ink/40 dark:hover:text-slate-ink"
                                    >
                                        <span>Cetak / PDF</span>
                                    </button>
                                </div>
                            </div>

                            <div className="shrink-0">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={`Foto profil ${fullName}`}
                                        width={128}
                                        height={128}
                                        fetchPriority="high"
                                        className="h-24 w-24 rounded-lg border border-paper-border object-cover sm:h-32 sm:w-32 dark:border-slate-border"
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className="flex h-24 w-24 items-center justify-center rounded-lg border border-paper-border bg-paper-card font-serif text-3xl font-semibold text-ink sm:h-32 sm:w-32 dark:border-slate-border dark:bg-slate-card dark:text-slate-ink"
                                    >
                                        {initials || 'W'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Ringkasan / Tentang */}
                    <section id="ringkasan" className="scroll-mt-20 border-b border-paper-border py-10 dark:border-slate-border">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
                            <h2 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                                Ringkasan
                            </h2>
                            <div className="max-w-2xl text-base leading-relaxed text-ink-muted dark:text-slate-muted">
                                {profile?.summary ? (
                                    <p className="whitespace-pre-line">{profile.summary}</p>
                                ) : (
                                    <p>Belum ada ringkasan profil.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Pengalaman Kerja */}
                    <section id="pengalaman" className="scroll-mt-20 border-b border-paper-border py-10 dark:border-slate-border">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
                            <h2 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                                Pengalaman
                            </h2>

                            {experiences.length === 0 ? (
                                <p className="text-sm text-ink-muted dark:text-slate-muted">
                                    Belum ada riwayat pengalaman kerja.
                                </p>
                            ) : (
                                <div className="space-y-8">
                                    {experiences.map((exp, idx) => (
                                        <article
                                            key={exp.id || idx}
                                            className="border-l-2 border-paper-border pl-5 dark:border-slate-border"
                                        >
                                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                                                <h3 className="text-lg font-semibold text-ink dark:text-slate-ink">
                                                    {exp.role}
                                                </h3>
                                                {exp.period && (
                                                    <span className="font-mono text-xs text-ink-muted dark:text-slate-muted">
                                                        {exp.period}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-sm font-medium text-accent dark:text-slate-accent">
                                                {exp.company}
                                                {exp.location ? ` · ${exp.location}` : ''}
                                            </p>
                                            {exp.description && (
                                                <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-ink-muted dark:text-slate-muted">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Proyek & Subdomain */}
                    <section id="proyek" className="scroll-mt-20 border-b border-paper-border py-10 dark:border-slate-border">
                        <div>
                            <h2 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                                Proyek &amp; Subdomain
                            </h2>
                            <p className="mt-1 text-sm text-ink-muted dark:text-slate-muted">
                                Daftar aplikasi dan repositori yang dikerjakan beserta tautan deploy subdomain.
                            </p>
                        </div>

                        {projects.length === 0 ? (
                            <div className="mt-6 rounded-lg border border-paper-border bg-paper-card p-6 text-sm text-ink-muted dark:border-slate-border dark:bg-slate-card dark:text-slate-muted">
                                Belum ada proyek yang ditambahkan.
                            </div>
                        ) : (
                            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                                {projects.map((project) => {
                                    const stack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
                                    return (
                                        <article
                                            key={project.id}
                                            className={`flex flex-col justify-between rounded-lg border p-5 transition-colors ${
                                                project.is_featured
                                                    ? 'border-accent/40 bg-paper-card md:col-span-2 dark:border-slate-accent/40 dark:bg-slate-card'
                                                    : 'border-paper-border bg-paper-card dark:border-slate-border dark:bg-slate-card'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-lg font-semibold text-ink dark:text-slate-ink">
                                                        {project.title}
                                                    </h3>
                                                    {project.status === 'coming_soon' && (
                                                        <span className="shrink-0 rounded border border-paper-border px-2 py-0.5 text-xs font-medium text-ink-muted dark:border-slate-border dark:text-slate-muted">
                                                            Segera Hadir
                                                        </span>
                                                    )}
                                                </div>

                                                {project.description && (
                                                    <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-muted">
                                                        {project.description}
                                                    </p>
                                                )}

                                                {stack.length > 0 && (
                                                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Teknologi">
                                                        {stack.map((tech) => (
                                                            <li
                                                                key={tech}
                                                                className="rounded border border-paper-border bg-paper px-2 py-0.5 font-mono text-xs text-ink-muted dark:border-slate-border dark:bg-slate-bg dark:text-slate-muted"
                                                            >
                                                                {tech}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {(project.subdomain_url || project.github_url) && (
                                                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-paper-border pt-4 dark:border-slate-border">
                                                    {project.subdomain_url && (
                                                        <a
                                                            href={project.subdomain_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-accent px-3 py-2 font-mono text-xs font-medium text-white transition-colors hover:bg-accent-hover dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                                        >
                                                            <span>{project.subdomain_url.replace(/^https?:\/\//, '')}</span>
                                                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                                                <path d="M7 17L17 7M7 7h10v10" />
                                                            </svg>
                                                        </a>
                                                    )}

                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-paper-border px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/40 dark:border-slate-border dark:text-slate-ink dark:hover:border-slate-ink/40"
                                                        >
                                                            <span>Source Code</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Keahlian & Pendidikan */}
                    <section id="keahlian" className="scroll-mt-20 py-10">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                                    Keahlian Teknis
                                </h2>
                                {skills.length === 0 ? (
                                    <p className="mt-4 text-sm text-ink-muted dark:text-slate-muted">
                                        Belum ada daftar keahlian.
                                    </p>
                                ) : (
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <li
                                                key={skill}
                                                className="rounded-md border border-paper-border bg-paper-card px-3 py-1.5 text-sm font-medium text-ink dark:border-slate-border dark:bg-slate-card dark:text-slate-ink"
                                            >
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-ink dark:text-slate-ink">
                                    Pendidikan
                                </h2>
                                {educations.length === 0 ? (
                                    <p className="mt-4 text-sm text-ink-muted dark:text-slate-muted">
                                        Belum ada riwayat pendidikan.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-5">
                                        {educations.map((edu, idx) => (
                                            <article key={edu.id || idx}>
                                                <h3 className="text-base font-semibold text-ink dark:text-slate-ink">
                                                    {edu.institution}
                                                </h3>
                                                {edu.degree && (
                                                    <p className="text-sm text-ink-muted dark:text-slate-muted">
                                                        {edu.degree}
                                                    </p>
                                                )}
                                                {edu.period && (
                                                    <p className="mt-0.5 font-mono text-xs text-ink-muted dark:text-slate-muted">
                                                        {edu.period}
                                                    </p>
                                                )}
                                                {edu.description && (
                                                    <p className="mt-1.5 text-sm text-ink-muted dark:text-slate-muted">
                                                        {edu.description}
                                                    </p>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-paper-border py-8 print:hidden dark:border-slate-border">
                    <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:px-6 dark:text-slate-muted">
                        <p>{fullName} · {location}</p>
                        <div className="flex flex-wrap items-center gap-4">
                            {profile?.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center hover:text-ink dark:hover:text-slate-ink"
                                >
                                    GitHub
                                </a>
                            )}
                            {profile?.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center hover:text-ink dark:hover:text-slate-ink"
                                >
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
