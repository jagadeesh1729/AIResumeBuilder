import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor, sections }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const [year, month] = dateStr.split("-");
            return new Date(year, month - 1).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
            });
        } catch (e) {
            return dateStr;
        }
    };

    const sectionComponents = {
        summary: data?.professional_summary && (
            <section key="summary" className="mb-6 break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: accentColor }}>
                    Summary
                </h2>
                <p className="text-zinc-700 leading-relaxed text-sm">
                    {data.professional_summary}
                </p>
            </section>
        ),
        experience: data?.experience?.length > 0 && (
            <section key="experience" className="mb-6 break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: accentColor }}>
                    Experience
                </h2>
                <div className="space-y-5">
                    {data.experience.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-base text-zinc-900">
                                    {exp.position}
                                </h3>
                                <span className="text-xs font-mono text-zinc-500">
                                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                </span>
                            </div>
                            <p className="text-sm mb-1 font-semibold" style={{ color: accentColor }}>
                                {exp.company}
                            </p>
                            {exp.description && (
                                <div
                                    className="text-zinc-700 leading-normal whitespace-pre-line text-sm"
                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ),
        projects: data?.project?.length > 0 && (
            <section key="projects" className="break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: accentColor }}>
                    Projects
                </h2>
                <div className="space-y-4">
                    {data.project.map((project) => (
                        <div key={project.id}>
                            <h3 className="text-base font-semibold text-zinc-800">{project.name}</h3>
                            <p className="text-xs mb-1 font-medium uppercase" style={{ color: accentColor }}>
                                {project.type}
                            </p>
                            {project.description && (
                                <p className="text-zinc-700 text-sm">{project.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: data?.education?.length > 0 && (
            <section key="education" className="mb-6 break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest text-zinc-600 mb-3 uppercase">
                    Education
                </h2>
                <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id}>
                            <p className="font-semibold text-sm">{edu.degree}</p>
                            <p className="text-zinc-700 text-xs">{edu.institution}</p>
                            <p className="text-zinc-500 text-xs">
                                {formatDate(edu.graduation_date)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        skills: data?.skills?.length > 0 && (
            <section key="skills" className="mb-6 break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest text-zinc-600 mb-3 uppercase">
                    Skills
                </h2>
                <ul className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                        <li key={skill} className="bg-zinc-200 text-zinc-800 text-xs font-medium px-2 py-1 rounded-md">{skill}</li>
                    ))}
                </ul>
            </section>
        ),
        certifications: data?.certifications?.length > 0 && (
            <section key="certifications" className="break-inside-avoid">
                <h2 className="text-sm font-bold tracking-widest text-zinc-600 mb-3 uppercase">
                    Certifications
                </h2>
                <div className="space-y-3">
                    {data.certifications.map((cert) => (
                        <div key={cert.id}>
                            <p className="font-semibold text-sm">{cert.name}</p>
                            <p className="text-zinc-700 text-xs">{cert.organization}</p>
                            <p className="text-zinc-500 text-xs">
                                {formatDate(cert.date)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        )
    };

    const sidebarSections = sections?.filter(section => ['education', 'skills', 'certifications'].includes(section.id));
    const mainSections = sections?.filter(section => ['summary', 'experience', 'projects'].includes(section.id));

    return (
        <div className="bg-white text-zinc-800 text-sm font-sans">
            <div className="flex">
                {/* Left Sidebar */}
                <aside className="w-1/3 bg-zinc-50 p-6 border-r border-zinc-200">
                    {data.personal_info?.image && (
                        <div className="mb-6">
                            <img
                                src={typeof data.personal_info.image === 'object' ? URL.createObjectURL(data.personal_info.image) : data.personal_info.image}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                        </div>
                    )}

                    <section className="mb-6">
                        <h2 className="text-sm font-bold tracking-widest text-zinc-600 mb-3 uppercase">
                            Contact
                        </h2>
                        <div className="space-y-2 text-xs">
                            {data.personal_info?.phone && (
                                <a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                                    <Phone size={12} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </a>
                            )}
                            {data.personal_info?.email && (
                                <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 hover:text-blue-600">
                                    <Mail size={12} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.email}</span>
                                </a>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                            {data.personal_info?.linkedin && (
                                <a href={data.personal_info.linkedin} className="flex items-center gap-2 hover:text-blue-600">
                                    <Linkedin size={12} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.linkedin.replace('https://www.', '')}</span>
                                </a>
                            )}
                            {data.personal_info?.website && (
                                <a href={data.personal_info.website} className="flex items-center gap-2 hover:text-blue-600">
                                    <Globe size={12} style={{ color: accentColor }} />
                                    <span className="break-all">{data.personal_info.website.replace('https://', '')}</span>
                                </a>
                            )}
                        </div>
                    </section>

                    {sidebarSections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
                </aside>

                {/* Right Content */}
                <main className="w-2/3 p-8">
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-zinc-800 tracking-wider">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                    </header>

                    <div className="space-y-6">
                      {mainSections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MinimalImageTemplate;
