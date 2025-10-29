import HeaderContact from "./common/HeaderContact";

const ClassicTemplate = ({ data, accentColor, sections }) => {
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
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Professional Summary
                </h2>
                <div className="h-0.5 bg-gray-200 mb-3" />
                <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
            </section>
        ),
        experience: data?.experience?.length > 0 && (
            <section key="experience" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Professional Experience
                </h2>
                <div className="h-0.5 bg-gray-200 mb-4" />
                <div className="space-y-5">
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="break-inside-avoid">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-base text-gray-900">{exp.position}</h3>
                                <p className="text-sm text-gray-600 font-mono">
                                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                </p>
                            </div>
                            <p className="text-gray-800 font-semibold text-base">{exp.company}</p>
                            {exp.description && (
                                <div
                                    className="text-gray-700 leading-normal whitespace-pre-line text-sm mt-2"
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
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Projects
                </h2>
                <div className="h-0.5 bg-gray-200 mb-4" />
                <div className="space-y-4">
                    {data.project.map((proj) => (
                        <div key={proj.id} className="break-inside-avoid">
                            <h3 className="font-bold text-base text-gray-900">{proj.name}</h3>
                            {proj.type && <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{proj.type}</p>}
                            <p className="text-gray-700 leading-relaxed text-sm mt-1">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        certifications: data?.certifications?.length > 0 && (
            <section key="certifications" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Certifications
                </h2>
                <div className="h-0.5 bg-gray-200 mb-4" />
                <div className="space-y-3">
                    {data.certifications.map((cert) => (
                        <div key={cert.id} className="flex justify-between items-start break-inside-avoid">
                            <div>
                                <h3 className="font-semibold text-base text-gray-900">{cert.name}</h3>
                                <p className="text-gray-700">{cert.organization}</p>
                            </div>
                            <p className="text-sm text-gray-600 font-mono">{formatDate(cert.date)}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: data?.education?.length > 0 && (
            <section key="education" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Education
                </h2>
                <div className="h-0.5 bg-gray-200 mb-4" />
                <div className="space-y-3">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="flex justify-between items-start break-inside-avoid">
                            <div>
                                <h3 className="font-bold text-base text-gray-900">
                                    {edu.degree} {edu.field && <span className="font-semibold text-gray-700">in {edu.field}</span>}
                                </h3>
                                <p className="text-gray-800">{edu.institution}</p>
                                {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                            </div>
                            <p className="text-sm text-gray-600 font-mono">{formatDate(edu.graduation_date)}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        skills: data?.skills?.length > 0 && (
            <section key="skills" className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: accentColor }}>
                    Core Skills
                </h2>
                <div className="h-0.5 bg-gray-200 mb-3" />
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                        <span key={skill} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>
        )
    };

    return (
        <div className="p-2 bg-white text-gray-800 font-sans text-sm">
            <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-4xl font-bold mb-1" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-1">
                    <HeaderContact personal={data.personal_info} accentColor={accentColor} className="text-sm text-gray-600" />
                </div>
            </header>

            <main className="space-y-6">
                {sections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
            </main>
        </div>
    );
}

export default ClassicTemplate;
