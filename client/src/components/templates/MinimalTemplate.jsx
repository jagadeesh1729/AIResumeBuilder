import HeaderContact from "./common/HeaderContact";

const MinimalTemplate = ({ data, accentColor, sections }) => {
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
                <p className="text-gray-700 leading-relaxed text-sm">
                    {data.professional_summary}
                </p>
            </section>
        ),
        experience: data?.experience?.length > 0 && (
            <section key="experience" className="mb-6 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                    Experience
                </h2>
                <div className="space-y-4">
                    {data.experience.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-base font-bold text-gray-800">{exp.position}</h3>
                                <p className="text-xs font-mono text-gray-500">
                                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                </p>
                            </div>
                            <p className="text-gray-700 mb-1 font-semibold">{exp.company}</p>
                            {exp.description && (
                                <div
                                    className="text-gray-700 leading-normal whitespace-pre-line text-sm"
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
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                    Projects
                </h2>
                <div className="space-y-4">
                    {data.project.map((proj) => (
                        <div key={proj.id}>
                            <h3 className="text-base font-bold text-gray-800">{proj.name}</h3>
                            {proj.type && <p className="text-gray-600 mb-1 text-xs font-medium uppercase">{proj.type}</p>}
                            <p className="text-gray-700 leading-relaxed text-sm">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        certifications: data?.certifications?.length > 0 && (
            <section key="certifications" className="mb-6 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                    Certifications
                </h2>
                <div className="space-y-3">
                    {data.certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-base text-gray-800">{cert.name}</h3>
                                <p className="text-gray-600 text-sm">{cert.organization}</p>
                            </div>
                            <p className="text-xs font-mono text-gray-500">
                                {formatDate(cert.date)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: data?.education?.length > 0 && (
            <section key="education" className="mb-6 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                    Education
                </h2>
                <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-base text-gray-800">
                                    {edu.degree} {edu.field && <span className="font-semibold text-gray-600">in {edu.field}</span>}
                                </h3>
                                <p className="text-gray-700 text-sm">{edu.institution}</p>
                                {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                            </div>
                            <p className="text-xs font-mono text-gray-500">
                                {formatDate(edu.graduation_date)}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        skills: data?.skills?.length > 0 && (
            <section key="skills" className="break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentColor }}>
                    Skills
                </h2>
                <p className="text-gray-700 text-sm">
                    {data.skills.join("  •  ")}
                </p>
            </section>
        )
    };

    return (
        <div className="p-4 bg-white text-gray-900 font-light text-sm">
            {/* Header */}
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-thin tracking-widest uppercase">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="h-px bg-gray-200 my-3" />
                <div className="flex justify-center flex-wrap gap-x-4">
                    <HeaderContact personal={data.personal_info} accentColor={accentColor} className="text-xs text-gray-600" />
                </div>
            </header>

            <main className="space-y-6">
                {sections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
            </main>
        </div>
    );
}

export default MinimalTemplate;
