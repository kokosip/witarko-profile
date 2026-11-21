import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ThemeToggle from '../Components/ThemeToggle';

const emptyProjectForm = {
    title: '',
    description: '',
    subdomain_url: '',
    github_url: '',
    tech_stack: [],
    status: 'published',
    is_featured: false,
    sort_order: 0,
};

export default function Admin({ profile, projects = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('profile');
    const [skillInput, setSkillInput] = useState('');
    const [techInput, setTechInput] = useState('');
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [dismissFlash, setDismissFlash] = useState(false);

    useEffect(() => {
        setDismissFlash(false);
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (deleteTarget) {
                    setDeleteTarget(null);
                } else if (projectModalOpen) {
                    setProjectModalOpen(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [deleteTarget, projectModalOpen]);

    const profileForm = useForm({
        full_name: profile?.full_name || '',
        headline: profile?.headline || '',
        location: profile?.location || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        summary: profile?.summary || '',
        quote: profile?.quote || '',
        github_url: profile?.github_url || '',
        linkedin_url: profile?.linkedin_url || '',
        website_url: profile?.website_url || '',
        avatar_url: profile?.avatar_url || '',
        skills: Array.isArray(profile?.skills) ? profile.skills : [],
        experiences: Array.isArray(profile?.experiences) ? profile.experiences : [],
        educations: Array.isArray(profile?.educations) ? profile.educations : [],
    });

    const projectForm = useForm(emptyProjectForm);

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.put('/admin/profile', {
            preserveScroll: true,
        });
    };

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (!trimmed || profileForm.data.skills.includes(trimmed)) {
            setSkillInput('');
            return;
        }
        profileForm.setData('skills', [...profileForm.data.skills, trimmed]);
        setSkillInput('');
    };

    const removeSkill = (skillToRemove) => {
        profileForm.setData(
            'skills',
            profileForm.data.skills.filter((s) => s !== skillToRemove)
        );
    };

    const addExperience = () => {
        profileForm.setData('experiences', [
            ...profileForm.data.experiences,
            {
                id: `exp-${Date.now()}`,
                role: '',
                company: '',
                period: '',
                location: '',
                description: '',
            },
        ]);
    };

    const updateExperience = (index, field, value) => {
        const next = [...profileForm.data.experiences];
        next[index] = { ...next[index], [field]: value };
        profileForm.setData('experiences', next);
    };

    const removeExperience = (index) => {
        profileForm.setData(
            'experiences',
            profileForm.data.experiences.filter((_, i) => i !== index)
        );
    };

    const addEducation = () => {
        profileForm.setData('educations', [
            ...profileForm.data.educations,
            {
                id: `edu-${Date.now()}`,
                institution: '',
                degree: '',
                period: '',
                description: '',
            },
        ]);
    };

    const updateEducation = (index, field, value) => {
        const next = [...profileForm.data.educations];
        next[index] = { ...next[index], [field]: value };
        profileForm.setData('educations', next);
    };

    const removeEducation = (index) => {
        profileForm.setData(
            'educations',
            profileForm.data.educations.filter((_, i) => i !== index)
        );
    };

    const openCreateProject = () => {
        setEditingProject(null);
        projectForm.setData({
            ...emptyProjectForm,
            sort_order: projects.length + 1,
        });
        projectForm.clearErrors();
        setTechInput('');
        setProjectModalOpen(true);
    };

    const openEditProject = (project) => {
        setEditingProject(project);
        projectForm.setData({
            title: project.title || '',
            description: project.description || '',
            subdomain_url: project.subdomain_url || '',
            github_url: project.github_url || '',
            tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
            status: project.status || 'published',
            is_featured: Boolean(project.is_featured),
            sort_order: project.sort_order ?? 0,
        });
        projectForm.clearErrors();
        setTechInput('');
        setProjectModalOpen(true);
    };

    const addTechTag = () => {
        const trimmed = techInput.trim();
        if (!trimmed || projectForm.data.tech_stack.includes(trimmed)) {
            setTechInput('');
            return;
        }
        projectForm.setData('tech_stack', [...projectForm.data.tech_stack, trimmed]);
        setTechInput('');
    };

    const removeTechTag = (tag) => {
        projectForm.setData(
            'tech_stack',
            projectForm.data.tech_stack.filter((t) => t !== tag)
        );
    };

    const submitProject = (e) => {
        e.preventDefault();
        if (editingProject) {
            projectForm.put(`/admin/projects/${editingProject.id}`, {
                preserveScroll: true,
                onSuccess: () => setProjectModalOpen(false),
            });
        } else {
            projectForm.post('/admin/projects', {
                preserveScroll: true,
                onSuccess: () => setProjectModalOpen(false),
            });
        }
    };

    const confirmDeleteProject = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/projects/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const inputClass =
        'mt-1.5 block w-full rounded-md border border-paper-border bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent dark:border-slate-border dark:bg-slate-bg dark:text-slate-ink dark:placeholder:text-slate-muted/60 dark:focus:border-slate-accent';
    const labelClass = 'block text-sm font-medium text-ink dark:text-slate-ink';

    return (
        <>
            <Head title="Admin | Kelola CV & Proyek" />

            <div className="min-h-screen bg-paper text-ink transition-colors dark:bg-slate-bg dark:text-slate-ink">
                <header className="sticky top-0 z-30 border-b border-paper-border bg-paper/95 backdrop-blur-sm dark:border-slate-border dark:bg-slate-bg/95">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                                Admin Profil
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border bg-paper-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/40 dark:border-slate-border dark:bg-slate-card dark:text-slate-ink dark:hover:border-slate-ink/40"
                            >
                                Lihat CV Publik
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                    {!dismissFlash && (flash?.success || flash?.error) && (
                        <div
                            role="status"
                            className={`mb-6 flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm ${
                                flash?.error
                                    ? 'border-red-600/40 bg-red-50 text-red-900 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200'
                                    : 'border-accent/40 bg-paper-card text-ink dark:border-slate-accent/40 dark:bg-slate-card dark:text-slate-ink'
                            }`}
                        >
                            <span>{flash?.error || flash?.success}</span>
                            <button
                                type="button"
                                onClick={() => setDismissFlash(true)}
                                aria-label="Tutup notifikasi"
                                className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded text-xs font-medium hover:underline"
                            >
                                Tutup
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div
                        role="tablist"
                        aria-label="Bagian pengelolaan"
                        className="mb-8 flex flex-wrap gap-2 border-b border-paper-border pb-3 dark:border-slate-border"
                    >
                        {[
                            { id: 'profile', label: 'Profil & Ringkasan' },
                            { id: 'experience', label: 'Pengalaman, Pendidikan & Keahlian' },
                            { id: 'projects', label: `Daftar Proyek (${projects.length})` },
                        ].map((tab) => {
                            const selected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-flex min-h-[44px] items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                        selected
                                            ? 'bg-accent text-white dark:bg-slate-accent dark:text-slate-bg'
                                            : 'border border-paper-border bg-paper-card text-ink-muted hover:text-ink dark:border-slate-border dark:bg-slate-card dark:text-slate-muted dark:hover:text-slate-ink'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab 1: Profile */}
                    {activeTab === 'profile' && (
                        <form onSubmit={submitProfile} className="space-y-6 rounded-lg border border-paper-border bg-paper-card p-5 sm:p-6 dark:border-slate-border dark:bg-slate-card">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="full_name" className={labelClass}>
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="full_name"
                                        type="text"
                                        required
                                        value={profileForm.data.full_name}
                                        onChange={(e) => profileForm.setData('full_name', e.target.value)}
                                        className={inputClass}
                                    />
                                    {profileForm.errors.full_name && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {profileForm.errors.full_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="location" className={labelClass}>
                                        Lokasi
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={profileForm.data.location}
                                        onChange={(e) => profileForm.setData('location', e.target.value)}
                                        placeholder="Yogyakarta, Indonesia"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="headline" className={labelClass}>
                                        Headline Profesional
                                    </label>
                                    <input
                                        id="headline"
                                        type="text"
                                        value={profileForm.data.headline}
                                        onChange={(e) => profileForm.setData('headline', e.target.value)}
                                        placeholder="Contoh: Fullstack Software Engineer (Laravel, Go, Flutter)"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClass}>
                                        Email Publik
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        placeholder="email@domain.com"
                                        className={inputClass}
                                    />
                                    {profileForm.errors.email && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {profileForm.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="avatar_url" className={labelClass}>
                                        URL Foto Profil
                                    </label>
                                    <input
                                        id="avatar_url"
                                        type="url"
                                        value={profileForm.data.avatar_url}
                                        onChange={(e) => profileForm.setData('avatar_url', e.target.value)}
                                        placeholder="https://avatars.githubusercontent.com/..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="github_url" className={labelClass}>
                                        URL GitHub
                                    </label>
                                    <input
                                        id="github_url"
                                        type="url"
                                        value={profileForm.data.github_url}
                                        onChange={(e) => profileForm.setData('github_url', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="linkedin_url" className={labelClass}>
                                        URL LinkedIn
                                    </label>
                                    <input
                                        id="linkedin_url"
                                        type="url"
                                        value={profileForm.data.linkedin_url}
                                        onChange={(e) => profileForm.setData('linkedin_url', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="quote" className={labelClass}>
                                        Bio Singkat / Kutipan
                                    </label>
                                    <input
                                        id="quote"
                                        type="text"
                                        value={profileForm.data.quote}
                                        onChange={(e) => profileForm.setData('quote', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="summary" className={labelClass}>
                                        Ringkasan Profil
                                    </label>
                                    <textarea
                                        id="summary"
                                        rows={5}
                                        value={profileForm.data.summary}
                                        onChange={(e) => profileForm.setData('summary', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-paper-border pt-4 dark:border-slate-border">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Profil'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab 2: Experiences, Educations & Skills */}
                    {activeTab === 'experience' && (
                        <form onSubmit={submitProfile} className="space-y-8">
                            {/* Skills */}
                            <section className="rounded-lg border border-paper-border bg-paper-card p-5 sm:p-6 dark:border-slate-border dark:bg-slate-card">
                                <h2 className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                                    Keahlian Teknis
                                </h2>
                                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                    <label htmlFor="new_skill" className="sr-only">
                                        Tambah keahlian
                                    </label>
                                    <input
                                        id="new_skill"
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                        placeholder="Contoh: Laravel, PostgreSQL, Docker"
                                        className="block w-full rounded-md border border-paper-border bg-paper px-3 py-2.5 text-sm text-ink dark:border-slate-border dark:bg-slate-bg dark:text-slate-ink"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md border border-paper-border px-4 py-2 text-sm font-medium text-ink hover:border-ink/40 dark:border-slate-border dark:text-slate-ink dark:hover:border-slate-ink/40"
                                    >
                                        Tambah Keahlian
                                    </button>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {profileForm.data.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-2 rounded-md border border-paper-border bg-paper px-3 py-1.5 text-sm dark:border-slate-border dark:bg-slate-bg"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                aria-label={`Hapus ${skill}`}
                                                className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:text-red-600 dark:text-slate-muted dark:hover:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Experiences */}
                            <section className="rounded-lg border border-paper-border bg-paper-card p-5 sm:p-6 dark:border-slate-border dark:bg-slate-card">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                                        Pengalaman Kerja
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addExperience}
                                        className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40 dark:border-slate-border dark:text-slate-ink dark:hover:border-slate-ink/40"
                                    >
                                        + Tambah Pengalaman
                                    </button>
                                </div>

                                <div className="mt-5 space-y-6">
                                    {profileForm.data.experiences.length === 0 && (
                                        <p className="text-sm text-ink-muted dark:text-slate-muted">
                                            Belum ada pengalaman kerja. Klik tombol Tambah Pengalaman untuk memulai.
                                        </p>
                                    )}
                                    {profileForm.data.experiences.map((exp, idx) => (
                                        <div
                                            key={exp.id || idx}
                                            className="space-y-4 rounded-md border border-paper-border bg-paper p-4 dark:border-slate-border dark:bg-slate-bg"
                                        >
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label htmlFor={`exp-role-${idx}`} className={labelClass}>
                                                        Posisi / Jabatan
                                                    </label>
                                                    <input
                                                        id={`exp-role-${idx}`}
                                                        type="text"
                                                        required
                                                        value={exp.role}
                                                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`exp-company-${idx}`} className={labelClass}>
                                                        Perusahaan / Organisasi
                                                    </label>
                                                    <input
                                                        id={`exp-company-${idx}`}
                                                        type="text"
                                                        required
                                                        value={exp.company}
                                                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`exp-period-${idx}`} className={labelClass}>
                                                        Periode
                                                    </label>
                                                    <input
                                                        id={`exp-period-${idx}`}
                                                        type="text"
                                                        value={exp.period}
                                                        onChange={(e) => updateExperience(idx, 'period', e.target.value)}
                                                        placeholder="Jan 2022 - Sekarang"
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`exp-location-${idx}`} className={labelClass}>
                                                        Lokasi
                                                    </label>
                                                    <input
                                                        id={`exp-location-${idx}`}
                                                        type="text"
                                                        value={exp.location}
                                                        onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor={`exp-desc-${idx}`} className={labelClass}>
                                                        Deskripsi
                                                    </label>
                                                    <textarea
                                                        id={`exp-desc-${idx}`}
                                                        rows={3}
                                                        value={exp.description}
                                                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperience(idx)}
                                                    className="inline-flex min-h-[44px] items-center rounded px-3 py-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                                                >
                                                    Hapus Pengalaman
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Educations */}
                            <section className="rounded-lg border border-paper-border bg-paper-card p-5 sm:p-6 dark:border-slate-border dark:bg-slate-card">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                                        Pendidikan
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addEducation}
                                        className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40 dark:border-slate-border dark:text-slate-ink dark:hover:border-slate-ink/40"
                                    >
                                        + Tambah Pendidikan
                                    </button>
                                </div>

                                <div className="mt-5 space-y-6">
                                    {profileForm.data.educations.length === 0 && (
                                        <p className="text-sm text-ink-muted dark:text-slate-muted">
                                            Belum ada data pendidikan.
                                        </p>
                                    )}
                                    {profileForm.data.educations.map((edu, idx) => (
                                        <div
                                            key={edu.id || idx}
                                            className="space-y-4 rounded-md border border-paper-border bg-paper p-4 dark:border-slate-border dark:bg-slate-bg"
                                        >
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label htmlFor={`edu-inst-${idx}`} className={labelClass}>
                                                        Institusi / Universitas
                                                    </label>
                                                    <input
                                                        id={`edu-inst-${idx}`}
                                                        type="text"
                                                        required
                                                        value={edu.institution}
                                                        onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`edu-deg-${idx}`} className={labelClass}>
                                                        Gelar / Jurusan
                                                    </label>
                                                    <input
                                                        id={`edu-deg-${idx}`}
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`edu-period-${idx}`} className={labelClass}>
                                                        Periode
                                                    </label>
                                                    <input
                                                        id={`edu-period-${idx}`}
                                                        type="text"
                                                        value={edu.period}
                                                        onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                                                        placeholder="2016 - 2020"
                                                        className={inputClass}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`edu-desc-${idx}`} className={labelClass}>
                                                        Catatan (opsional)
                                                    </label>
                                                    <input
                                                        id={`edu-desc-${idx}`}
                                                        type="text"
                                                        value={edu.description}
                                                        onChange={(e) => updateEducation(idx, 'description', e.target.value)}
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeEducation(idx)}
                                                    className="inline-flex min-h-[44px] items-center rounded px-3 py-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                                                >
                                                    Hapus Pendidikan
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60 dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                >
                                    {profileForm.processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Tab 3: Projects */}
                    {activeTab === 'projects' && (
                        <section className="space-y-5">
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <p className="text-sm text-ink-muted dark:text-slate-muted">
                                    Tambahkan proyek beserta URL subdomain tempat aplikasi di-deploy.
                                </p>
                                <button
                                    type="button"
                                    onClick={openCreateProject}
                                    className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                >
                                    + Tambah Proyek
                                </button>
                            </div>

                            {projects.length === 0 ? (
                                <div className="rounded-lg border border-paper-border bg-paper-card p-6 text-sm text-ink-muted dark:border-slate-border dark:bg-slate-card dark:text-slate-muted">
                                    Belum ada proyek tersimpan. Klik + Tambah Proyek untuk menambahkan proyek baru.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex flex-col justify-between gap-4 rounded-lg border border-paper-border bg-paper-card p-4 sm:flex-row sm:items-center dark:border-slate-border dark:bg-slate-card"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-semibold text-ink dark:text-slate-ink">
                                                        {project.title}
                                                    </h3>
                                                    {project.is_featured && (
                                                        <span className="rounded border border-accent/40 px-2 py-0.5 text-xs font-medium text-accent dark:border-slate-accent/40 dark:text-slate-accent">
                                                            Unggulan
                                                        </span>
                                                    )}
                                                    <span className="rounded border border-paper-border px-2 py-0.5 text-xs text-ink-muted dark:border-slate-border dark:text-slate-muted">
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <p className="mt-1 truncate font-mono text-xs text-ink-muted dark:text-slate-muted">
                                                    Subdomain: {project.subdomain_url || 'Belum diisi'}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditProject(project)}
                                                    className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40 dark:border-slate-border dark:text-slate-ink dark:hover:border-slate-ink/40"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(project)}
                                                    className="inline-flex min-h-[44px] items-center rounded-md border border-red-600/30 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-950/30"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </main>
            </div>

            {/* Project Create / Edit Modal */}
            {projectModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-paper-border bg-paper-card p-5 sm:p-6 dark:border-slate-border dark:bg-slate-card">
                        <div className="flex items-center justify-between gap-4 border-b border-paper-border pb-3 dark:border-slate-border">
                            <h2 id="project-modal-title" className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setProjectModalOpen(false)}
                                aria-label="Tutup dialog"
                                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-ink-muted hover:text-ink dark:text-slate-muted dark:hover:text-slate-ink"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitProject} className="mt-5 space-y-4">
                            <div>
                                <label htmlFor="proj_title" className={labelClass}>
                                    Nama Proyek
                                </label>
                                <input
                                    id="proj_title"
                                    type="text"
                                    required
                                    value={projectForm.data.title}
                                    onChange={(e) => projectForm.setData('title', e.target.value)}
                                    className={inputClass}
                                />
                                {projectForm.errors.title && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {projectForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="proj_subdomain" className={labelClass}>
                                    URL Subdomain Deploy
                                </label>
                                <input
                                    id="proj_subdomain"
                                    type="url"
                                    value={projectForm.data.subdomain_url}
                                    onChange={(e) => projectForm.setData('subdomain_url', e.target.value)}
                                    placeholder="https://stream.domainkamu.com"
                                    className={inputClass}
                                />
                                {projectForm.errors.subdomain_url && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {projectForm.errors.subdomain_url}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="proj_github" className={labelClass}>
                                    URL Repositori GitHub
                                </label>
                                <input
                                    id="proj_github"
                                    type="url"
                                    value={projectForm.data.github_url}
                                    onChange={(e) => projectForm.setData('github_url', e.target.value)}
                                    placeholder="https://github.com/kokosip/nama-repo"
                                    className={inputClass}
                                />
                                {projectForm.errors.github_url && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {projectForm.errors.github_url}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="proj_desc" className={labelClass}>
                                    Deskripsi Proyek
                                </label>
                                <textarea
                                    id="proj_desc"
                                    rows={3}
                                    value={projectForm.data.description}
                                    onChange={(e) => projectForm.setData('description', e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="proj_tech" className={labelClass}>
                                    Tech Stack
                                </label>
                                <div className="mt-1.5 flex gap-2">
                                    <input
                                        id="proj_tech"
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTechTag();
                                            }
                                        }}
                                        placeholder="Laravel, React, PostgreSQL"
                                        className="block w-full rounded-md border border-paper-border bg-paper px-3 py-2 text-sm text-ink dark:border-slate-border dark:bg-slate-bg dark:text-slate-ink"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTechTag}
                                        className="inline-flex min-h-[44px] shrink-0 items-center rounded-md border border-paper-border px-3.5 text-sm font-medium dark:border-slate-border"
                                    >
                                        Tambah
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {projectForm.data.tech_stack.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 rounded border border-paper-border bg-paper px-2 py-1 font-mono text-xs dark:border-slate-border dark:bg-slate-bg"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTechTag(tag)}
                                                aria-label={`Hapus ${tag}`}
                                                className="text-ink-muted hover:text-red-600 dark:text-slate-muted dark:hover:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="proj_status" className={labelClass}>
                                        Status
                                    </label>
                                    <select
                                        id="proj_status"
                                        value={projectForm.data.status}
                                        onChange={(e) => projectForm.setData('status', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="published">Published</option>
                                        <option value="coming_soon">Segera Hadir (Coming Soon)</option>
                                        <option value="archived">Archived (Sembunyikan)</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="proj_order" className={labelClass}>
                                        Urutan Tampil
                                    </label>
                                    <input
                                        id="proj_order"
                                        type="number"
                                        min="0"
                                        value={projectForm.data.sort_order}
                                        onChange={(e) => projectForm.setData('sort_order', Number(e.target.value))}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    id="proj_featured"
                                    type="checkbox"
                                    checked={projectForm.data.is_featured}
                                    onChange={(e) => projectForm.setData('is_featured', e.target.checked)}
                                    className="h-4 w-4 accent-accent dark:accent-slate-accent"
                                />
                                <label htmlFor="proj_featured" className="text-sm font-medium text-ink dark:text-slate-ink">
                                    Tandai sebagai proyek unggulan (tampil lebar penuh)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-paper-border pt-4 dark:border-slate-border">
                                <button
                                    type="button"
                                    onClick={() => setProjectModalOpen(false)}
                                    className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border px-4 py-2 text-sm font-medium dark:border-slate-border"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={projectForm.processing}
                                    className="inline-flex min-h-[44px] items-center rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60 dark:bg-slate-accent dark:text-slate-bg dark:hover:bg-slate-accent-hover"
                                >
                                    {projectForm.processing ? 'Menyimpan...' : 'Simpan Proyek'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div className="w-full max-w-md rounded-lg border border-paper-border bg-paper-card p-5 dark:border-slate-border dark:bg-slate-card">
                        <h2 id="delete-modal-title" className="font-serif text-xl font-semibold text-ink dark:text-slate-ink">
                            Hapus Proyek?
                        </h2>
                        <p className="mt-2 text-sm text-ink-muted dark:text-slate-muted">
                            Proyek <strong>{deleteTarget.title}</strong> akan dihapus permanen dari database.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="inline-flex min-h-[44px] items-center rounded-md border border-paper-border px-4 py-2 text-sm font-medium dark:border-slate-border"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteProject}
                                className="inline-flex min-h-[44px] items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
