import HeaderContact from "./common/HeaderContact";

const ModernTemplate = ({ data, accentColor, sections }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const [year, month] = dateStr.split("-");
            return new Date(year, month - 1).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short"
            });
        } catch (e) {
            return dateStr;
        }
    };

    const sectionComponents = {
        summary: data?.professional_summary && (
            <section key="summary" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
            </section>
        ),
        experience: data?.experience?.length > 0 && (
            <section key="experience" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Experience
                </h2>
                <div className="space-y-5">
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="relative pl-6 border-l-4" style={{ borderColor: accentColor }}>
                            <div className="absolute -left-2.5 top-1 w-4 h-4 bg-white border-2 rounded-full" style={{ borderColor: accentColor }} />
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                                <p className="text-sm font-mono text-gray-600">
                                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                </p>
                            </div>
                            <p className="font-medium text-base" style={{ color: accentColor }}>{exp.company}</p>
                            {exp.description && (
                                <div
                                    className="text-gray-700 leading-normal mt-2 whitespace-pre-line text-sm"
                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ),
        projects: data?.project?.length > 0 && (
            <section key="projects" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Projects
                </h2>
                <div className="space-y-4">
                    {data.project.map((p) => (
                        <div key={p.id}>
                            <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                            {p.type && <p className="text-xs font-medium uppercase" style={{ color: accentColor }}>{p.type}</p>}
                            {p.description && (
                                <p className="text-gray-700 leading-normal text-sm mt-1">{p.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ),
        certifications: data?.certifications?.length > 0 && (
            <section key="certifications" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Certifications
                </h2>
                <div className="space-y-3">
                    {data.certifications.map((cert) => (
                        <div key={cert.id}>
                            <h3 className="font-semibold text-base text-gray-900">{cert.name}</h3>
                            <p className="text-sm" style={{ color: accentColor }}>{cert.organization}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(cert.date)}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: data?.education?.length > 0 && (
            <section key="education" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Education
                </h2>
                <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id}>
                            <h3 className="font-semibold text-base text-gray-900">
                                {edu.degree} {edu.field && <span className="font-normal">in {edu.field}</span>}
                            </h3>
                            <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                <span>{formatDate(edu.graduation_date)}</span>
                                {edu.gpa && <span>GPA: {edu.gpa}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        ),
        skills: data?.skills?.length > 0 && (
            <section key="skills" className="break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1 text-sm text-white rounded-full"
                            style={{ backgroundColor: accentColor }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
        )
    };

    return (
        <div className="bg-white text-gray-800 font-sans text-sm">
            <header className="p-8 text-white text-center" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-light mb-2">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="text-sm flex justify-center flex-wrap gap-x-4">
                    <HeaderContact personal={data.personal_info} accentColor="#FFFFFF" className="text-sm" />
                </div>
            </header>

            <main className="p-8">
                <div className="space-y-6">
                    {sections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
                </div>
            </main>
        </div>
    );
}

export default ModernTemplate;
