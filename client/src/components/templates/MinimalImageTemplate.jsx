import { Mail, Phone, MapPin } from "lucide-react";
import HeaderContact from "./common/HeaderContact";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800 text-sm font-sans">
            <div className="grid grid-cols-12">
                {/* Left Sidebar */}
                <aside className="col-span-4 border-r border-zinc-200 p-6">
                    {/* Image */}
                    {data.personal_info?.image && typeof data.personal_info.image === 'string' ? (
                        <div className="mb-6">
                            <img src={data.personal_info.image} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" style={{ background: accentColor + '70' }} />
                        </div>
                    ) : (
                        data.personal_info?.image && typeof data.personal_info.image === 'object' ? (
                            <div className="mb-6">
                                <img src={URL.createObjectURL(data.personal_info.image)} alt="Profile" className="w-32 h-32 object-cover rounded-full mx-auto" />
                            </div>
                        ) : null
                    )}

                    {/* Contact */}
                    <section className="mb-6">
                        <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-3 uppercase">
                            CONTACT
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
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-3 uppercase">
                                EDUCATION
                            </h2>
                            <div className="space-y-3 text-xs">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase text-sm">{edu.degree}</p>
                                        <p className="text-zinc-600">{edu.institution}</p>
                                        <p className="text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-3 uppercase">
                                SKILLS
                            </h2>
                            <ul className="space-y-1 text-xs list-disc list-inside">
                                {data.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certifications */}
                    {data.certifications && data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-xs font-semibold tracking-widest text-zinc-600 mb-3 uppercase">
                                CERTIFICATIONS
                            </h2>
                            <div className="space-y-3 text-xs">
                                {data.certifications.map((cert, index) => (
                                    <div key={index}>
                                        <p className="font-semibold uppercase text-sm">{cert.name}</p>
                                        <p className="text-zinc-600">{cert.organization}</p>
                                        <p className="text-zinc-500">
                                            {formatDate(cert.date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Right Content */}
                <main className="col-span-8 p-6">
                    {/* Name + Title */}
                    <header className="mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-700 tracking-wider">
                            {data.personal_info?.full_name || "Your Name"}
                        </h1>
                        <div className="mt-1">
                            <HeaderContact personal={data.personal_info} className="text-xs text-zinc-600" />
                        </div>
                    </header>

                    {/* Summary */}
                    {data.professional_summary && (
                        <section className="mb-6">
                            <h2 className="text-xs font-semibold tracking-widest mb-2 uppercase" style={{ color: accentColor }}>
                                SUMMARY
                            </h2>
                            <p className="text-zinc-700 leading-normal">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: accentColor }}>
                                EXPERIENCE
                            </h2>
                            <div className="space-y-5">
                                {data.experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-semibold text-base text-zinc-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-500">
                                                {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-1" style={{ color: accentColor }}>
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700 leading-normal space-y-1">
                                                {exp.description.split("\n").filter(l => l.trim()).map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <h2 className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>
                            <div className="space-y-4">
                                {data.project.map((project, index) => (
                                    <div key={index}>
                                        <h3 className="text-base font-medium text-zinc-800">{project.name}</h3>
                                        <p className="text-xs mb-1" style={{ color: accentColor }}>
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
                                                {project.description.split("\n").filter(l => l.trim()).map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}


export default MinimalImageTemplate;
