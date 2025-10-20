import HeaderContact from "./common/HeaderContact";

const ModernTemplate = ({ data, accentColor, sections }) => {
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
			<section key="summary" className="mb-6 break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-3 pb-2 border-b border-gray-200">
					Professional Summary
				</h2>
				<p className="text-gray-700 leading-normal">{data.professional_summary}</p>
			</section>
		),
		experience: (
			<section key="experience" className="mb-6 break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-4 pb-2 border-b border-gray-200">
					Experience
				</h2>
				<div className="space-y-5">
					{data.experience.map((exp, index) => (
						<div key={index} className="relative pl-5 border-l-2 border-gray-200">
							<div className="flex justify-between items-start mb-1">
								<div>
									<h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
									<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
								</div>
								<div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
									{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
								</div>
							</div>
							{exp.description && (
								<div className="text-gray-700 leading-normal mt-2 whitespace-pre-line text-sm">
									{exp.description}
								</div>
							)}
						</div>
					))}
				</div>
			</section>
		),
		projects: (
			<section key="projects" className="mb-6 break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-3 pb-2 border-b border-gray-200">
					Projects
				</h2>
				<div className="space-y-5">
					{data.project.map((p, index) => (
						<div key={index} className="relative pl-5 border-l-2" style={{ borderColor: accentColor }}>
							<h3 className="text-base font-medium text-gray-900">{p.name}</h3>
							{p.type && <p className="text-xs font-medium" style={{ color: accentColor }}>{p.type}</p>}
							{p.description && (
								<div className="text-gray-700 leading-normal text-sm mt-2">
									{p.description}
								</div>
							)}
						</div>
					))}
				</div>
			</section>
		),
		certifications: (
			<section key="certifications" className="break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-3 pb-2 border-b border-gray-200">
					Certifications
				</h2>
				<div className="space-y-3">
					{data.certifications.map((cert, index) => (
						<div key={index}>
							<h3 className="font-semibold text-base text-gray-900">{cert.name}</h3>
							<p className="text-sm" style={{ color: accentColor }}>{cert.organization}</p>
							<div className="flex justify-between items-center text-xs text-gray-600">
								<span>{formatDate(cert.date)}</span>
							</div>
						</div>
					))}
				</div>
			</section>
		),
		education: (
			<section key="education" className="break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-3 pb-2 border-b border-gray-200">
					Education
				</h2>
				<div className="space-y-3">
					{data.education.map((edu, index) => (
						<div key={index}>
							<h3 className="font-semibold text-base text-gray-900">
								{edu.degree} {edu.field && `in ${edu.field}`}
							</h3>
							<p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
							<div className="flex justify-between items-center text-xs text-gray-600">
								<span>{formatDate(edu.graduation_date)}</span>
								{edu.gpa && <span>GPA: {edu.gpa}</span>}
							</div>
						</div>
					))}
				</div>
			</section>
		),
		skills: (
			<section key="skills" className="break-inside-avoid">
				<h2 className="text-xl sm:text-2xl font-light mb-3 pb-2 border-b border-gray-200">
					Skills
				</h2>
				<div className="flex flex-wrap gap-2">
					{data.skills.map((skill, index) => (
						<span
							key={index}
							className="px-2 py-1 text-xs text-white rounded-full"
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
		<div className="max-w-4xl mx-auto bg-white text-gray-800 font-sans text-sm">
			{/* Header */}
			<header className="p-6 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-3xl sm:text-4xl font-light mb-1">
					{data.personal_info?.full_name || "Your Name"}
				</h1>
				<div className="text-sm">
					<HeaderContact personal={data.personal_info} className="text-xs sm:text-sm" />
				</div>
			</header>

			<div className="p-6">
				{sections?.map(section => sectionComponents[section.id])}
			</div>
		</div>
	);
}

export default ModernTemplate;
