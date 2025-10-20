import HeaderContact from "./common/HeaderContact";

const MinimalTemplate = ({ data, accentColor, sections }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    const sectionComponents = {
        summary: (
            <section key="summary" className="mb-8 break-inside-avoid">
                <p className="text-gray-700 leading-normal">
                    {data.professional_summary}
                </p>
            </section>
        ),
        experience: (
            <section key="experience" className="mb-8 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                    Experience
                </h2>
                <div className="space-y-5">
                    {data.experience.map((exp, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-base font-medium">{exp.position}</h3>
                                <span className="text-xs text-gray-500">
                                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-1">{exp.company}</p>
                            {exp.description && (
                                <div className="text-gray-700 leading-normal whitespace-pre-line text-sm">
                                    {exp.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ),
        projects: (
            <section key="projects" className="mb-8 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                    Projects
                </h2>
                <div className="space-y-4">
                    {data.project.map((proj, index) => (
                        <div key={index}>
                            <h3 className="text-base font-medium">{proj.name}</h3>
                            {proj.type && <p className="text-gray-600 mb-1 text-xs">{proj.type}</p>}
                            <p className="text-gray-700 leading-normal text-sm">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        ),
        certifications: (
            <section key="certifications" className="mb-8 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                    Certifications
                </h2>
                <div className="space-y-3">
                    {data.certifications.map((cert, index) => (
                        <div key={index} className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-medium text-base">{cert.name}</h3>
                                <p className="text-gray-600 text-sm">{cert.organization}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatDate(cert.date)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        ),
        education: (
            <section key="education" className="mb-8 break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                    Education
                </h2>
                <div className="space-y-3">
                    {data.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-medium text-base">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                </h3>
                                <p className="text-gray-600 text-sm">{edu.institution}</p>
                                {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatDate(edu.graduation_date)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        ),
        skills: (
            <section key="skills" className="break-inside-avoid">
                <h2 className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
                    Skills
                </h2>
                <div className="text-gray-700 text-sm">
                    {data.skills.join(" • ")}
                </div>
            </section>
        )
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 font-light text-sm">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-thin mb-1 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <HeaderContact personal={data.personal_info} className="text-xs sm:text-sm text-gray-600" />
            </header>

            {sections?.map(section => sectionComponents[section.id])}
        </div>
    );
}

export default MinimalTemplate;
 
