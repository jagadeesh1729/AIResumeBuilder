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
    const [year, month] = String(dateStr).split("-");
    const d = new Date(year, (month || 1) - 1, 1);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
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
      "Frontend",
      "Backend",
      "DevOps",
      "Cloud",
      "Data",
      "Mobile",
      "Testing",
      "Databases ",
      "Languages",
      "Frameworks",
      "Tools",
      "Other",
    ];
    const rows = [];
    order.forEach((k) => {
      const list = src[k];
      if (Array.isArray(list) && list.length) rows.push([k, list]);
    });
    Object.keys(src).forEach((k) => {
      if (!order.includes(k)) {
        const list = src[k];
        if (Array.isArray(list) && list.length) rows.push([k, list]);
      }
    });
    return rows;
  }, [categories, fallbackCategories]);

  const sectionComponents = {
    summary: (
      <section key="summary" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Summary
        </h2>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-normal">
          {data.professional_summary}
        </p>
      </section>
    ),
    skills: (
      <section key="skills" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Skills
        </h2>
        {loadingCats && (
          <div className="mt-1 text-xs text-gray-500">Categorizing skills…</div>
        )}
        <table className="w-full text-xs sm:text-sm">
          <tbody>
            {displayCategories.map(([cat, list]) => (
              <tr key={cat} className="align-top">
                <th className="text-left font-semibold align-top whitespace-nowrap pr-4 py-1" style={{ color: accentColor }}>
                  {cat}
                </th>
                <td className="py-1 text-gray-700 leading-normal">
                  {list.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    ),
    education: (
      <section key="education" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx} className="border-l-2 pl-3 break-inside-avoid avoid-break" style={{ borderColor: accentColor }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </h3>
                  <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                </div>
                <div className="text-xs text-gray-600">{formatDate(edu.graduation_date)}</div>
              </div>
              {edu.gpa && (
                <div className="mt-1 text-xs text-gray-700">GPA: {edu.gpa}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    certifications: (
      <section key="certifications" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Certifications
        </h2>
        <div className="space-y-3">
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="border-l-2 pl-3 break-inside-avoid avoid-break" style={{ borderColor: accentColor }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm" style={{ color: accentColor }}>{cert.organization}</p>
                </div>
                <div className="text-xs text-gray-600">{formatDate(cert.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    projects: (
      <section key="projects" className="mb-6 break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Projects
        </h2>
        <div className="space-y-4">
          {data.project.map((p, idx) => (
            <div key={idx} className="border-l-2 pl-3 break-inside-avoid avoid-break" style={{ borderColor: accentColor }}>
              <h3 className="text-base font-medium text-gray-900">{p.name}</h3>
              {p.type && <p className="text-xs" style={{ color: accentColor }}>{p.type}</p>}
              {p.description && (
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-line leading-normal">{p.description}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
    experience: (
      <section key="experience" className="break-inside-avoid">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: accentColor }}>
          Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="border-l-2 pl-3 break-inside-avoid avoid-break" style={{ borderColor: accentColor }}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                </div>
                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                </div>
              </div>
              {exp.description && (
                <div className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-normal">{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-sm font-sans">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <div className="mt-2">
          <HeaderContact personal={data.personal_info} className="text-xs sm:text-sm text-gray-700" />
        </div>
      </header>

      {/* Body */}
      <div className="p-6">
        {sections?.map(section => sectionComponents[section.id])}
      </div>
    </div>
  );
};

export default TechnicalTemplate;
