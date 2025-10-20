import HeaderContact from "./common/HeaderContact";

const ClassicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white text-gray-800 font-sans text-sm">
            {/* Header */}
            <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="flex justify-center">
                    <HeaderContact personal={data.personal_info} className="text-xs sm:text-sm text-gray-600" />
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-normal">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-semibold text-base text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-xs text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-normal whitespace-pre-line text-sm">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>
                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="border-l-2 pl-4" style={{ borderColor: accentColor }}>
                                <h3 className="font-semibold text-base text-gray-900">{proj.name}</h3>
                                {proj.type && <p className="text-xs text-gray-600 font-medium">{proj.type}</p>}
                                <p className="text-gray-700 leading-normal text-sm">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        CERTIFICATIONS
                    </h2>
                    <div className="space-y-3">
                        {data.certifications.map((cert, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900">{cert.name}</h3>
                                    <p className="text-gray-700">{cert.organization}</p>
                                </div>
                                <div className="text-xs text-gray-600">
                                    <p>{formatDate(cert.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>
                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-base text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-xs text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-5 break-inside-avoid">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        CORE SKILLS
                    </h2>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                        {data.skills.map((skill, index) => (
                            <li key={index} className="text-gray-700 list-disc list-inside">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;
