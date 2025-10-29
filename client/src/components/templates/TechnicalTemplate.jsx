import React, { useEffect, useMemo, useState } from "react";
import HeaderContact from "./common/HeaderContact";
import { useSelector } from "react-redux";
import api from "../../configs/api";

const TechnicalTemplate = ({ data, accentColor, sections }) => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState(null);
  const [loadingCats, setLoadingCats] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
        const [year, month] = String(dateStr).split("-");
        const d = new Date(year, (month || 1) - 1, 1);
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch(e) {
        return dateStr;
    }
  };

  const rawSkills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!rawSkills.length || !token) {
        setCategories(null);
        return;
      }
      try {
        setLoadingCats(true);
        const { data: resp } = await api.post(
          "/api/ai/categorize-skills",
          { skills: rawSkills },
          { headers: { Authorization: token } }
        );
        if (!cancelled) setCategories(resp?.categories || null);
      } catch (e) {
        if (!cancelled) setCategories(null);
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token, rawSkills.join("|")]);

  const fallbackCategories = useMemo(() => {
    if (!rawSkills.length) return null;
    const guess = {
      Frontend: [],
      Backend: [],
      DevOps: [],
      Data: [],
      Mobile: [],
      Testing: [],
      Databases: [],
      Tools: [],
      Other: []
    };
    const fe = /react|vue|angular|html|css|sass|tailwind|next|nuxt|vite|webpack|typescript|javascript/i;
    const be = /node|express|django|flask|fastapi|spring|rails|laravel|go\b|golang|.net|kotlin|java|python|ruby|php/i;
    const devops = /docker|kubernetes|terraform|ansible|github actions|circleci|jenkins|helm|argo/i;
    const cloud = /aws|gcp|google cloud|azure|cloudfront|lambda|ecs|eks|s3|cloud run|cloud functions/i;
    const data = /sql|nosql|pandas|spark|hadoop|kafka|airflow|dbt|etl|ml|machine learning|tensorflow|pytorch|scikit/i;
    const mobile = /react native|swift|objective\-c|kotlin|android|ios|flutter|dart/i;
    const test = /jest|mocha|chai|pytest|cypress|playwright|selenium|junit|karma|rtl/i;
    const db = /postgres|mysql|mariadb|sqlite|oracle|mongodb|dynamo|redis|cassandra|elasticsearch|neo4j/i;

    rawSkills.forEach((s) => {
      const v = String(s);
      if (fe.test(v)) return guess.Frontend.push(s);
      if (be.test(v)) return guess.Backend.push(s);
      if (devops.test(v) || cloud.test(v)) return guess.DevOps.push(s);
      if (data.test(v)) return guess.Data.push(s);
      if (mobile.test(v)) return guess.Mobile.push(s);
      if (test.test(v)) return guess.Testing.push(s);
      if (db.test(v)) return guess.Databases.push(s);
      return guess.Other.push(s);
    });
    return guess;
  }, [rawSkills.join(",")]);

  const displayCategories = useMemo(() => {
    const src = categories || fallbackCategories || {};
    const order = [
      "Frontend", "Backend", "DevOps", "Cloud", "Data", "Mobile",
      "Testing", "Databases ", "Languages", "Frameworks", "Tools", "Other",
    ];
    return order
        .map(k => [k, src[k]])
        .filter(([, list]) => Array.isArray(list) && list.length)
        .concat(
            Object.entries(src).filter(([k]) => !order.includes(k))
        );
  }, [categories, fallbackCategories]);

  const sectionComponents = {
    summary: data?.professional_summary && (
      <section key="summary" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Summary
        </h2>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {data.professional_summary}
        </p>
      </section>
    ),
    skills: rawSkills.length > 0 && (
      <section key="skills" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Technical Skills
        </h2>
        {loadingCats && (
          <div className="mt-1 text-xs text-gray-500">Categorizing skills…</div>
        )}
        <table className="w-full text-xs sm:text-sm border-separate border-spacing-x-2 border-spacing-y-1">
          <tbody>
            {displayCategories.map(([cat, list]) => (
              <tr key={cat} className="align-top">
                <th className="text-left font-semibold align-top whitespace-nowrap pr-3 py-0.5" style={{ color: accentColor }}>
                  {cat}
                </th>
                <td className="py-0.5 text-gray-700 leading-normal">
                  {list.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    ),
    education: data?.education?.length > 0 && (
      <section key="education" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {edu.degree} {edu.field ? <span className="font-medium text-gray-700">in {edu.field}</span> : ""}
                  </h3>
                  <p className="text-sm font-medium text-gray-800">{edu.institution}</p>
                </div>
                <p className="text-xs font-mono text-gray-600">{formatDate(edu.graduation_date)}</p>
              </div>
              {edu.gpa && (
                <p className="mt-1 text-xs text-gray-600">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    certifications: data?.certifications?.length > 0 && (
      <section key="certifications" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Certifications
        </h2>
        <div className="space-y-3">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm font-medium text-gray-800">{cert.organization}</p>
                </div>
                <p className="text-xs font-mono text-gray-600">{formatDate(cert.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    projects: data?.project?.length > 0 && (
      <section key="projects" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Projects
        </h2>
        <div className="space-y-4">
          {data.project.map((p) => (
            <div key={p.id} className="break-inside-avoid">
                <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                {p.type && <p className="text-xs font-medium uppercase tracking-wide" style={{ color: accentColor }}>{p.type}</p>}
                {p.description && (
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{p.description}</p>
                )}
            </div>
          ))}
        </div>
      </section>
    ),
    experience: data?.experience?.length > 0 && (
      <section key="experience" className="break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
          Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</p>
                </div>
                <p className="text-xs font-mono text-gray-600">
                  {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                </p>
              </div>
              {exp.description && (
                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </div>
      </section>
    )
  };

  return (
    <div className="bg-white text-gray-800 text-sm font-sans">
      <header className="p-4 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold tracking-tight text-center">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <div className="mt-2 flex justify-center flex-wrap gap-x-4">
          <HeaderContact personal={data.personal_info} accentColor={accentColor} className="text-xs text-gray-700" />
        </div>
      </header>

      <main className="p-4 space-y-4">
        {sections?.map(section => section.id in sectionComponents && sectionComponents[section.id])}
      </main>
    </div>
  );
};

export default TechnicalTemplate;
