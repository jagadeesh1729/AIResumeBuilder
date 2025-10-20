import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType, PageOrientation } from 'docx';
import puppeteer from 'puppeteer';

const inch = 1440; // docx measurement unit

function getTemplateStyles(template, accentColor) {
  const baseStyles = `
    body{font-family:Calibri,Arial,sans-serif;color:#222;line-height:1.6}
    h1{font-size:28px;margin:0 0 8px;font-weight:bold}
    .contact{font-size:14px;margin-bottom:20px}
    h2{font-size:18px;margin:24px 0 12px;font-weight:600}
    p,li{font-size:14px;line-height:1.5;margin:6px 0}
    .section{break-inside:avoid;margin-bottom:20px}
    .experience-item,.education-item,.project-item{margin-bottom:16px}
    .date{color:#666;font-size:13px}
    .company,.institution{font-weight:600}
    .position,.degree{font-weight:500}
  `;
  
  switch(template) {
    case 'modern':
      return baseStyles + `
        .modern-template h1{color:white;background-color:${accentColor};padding:20px;margin:0;text-align:center}
        .modern-template .contact{background-color:${accentColor};color:white;padding:10px 20px;margin:0}
        .modern-template h2{color:${accentColor};border-bottom:2px solid ${accentColor};padding-bottom:4px}
        .modern-template .company{color:${accentColor}}
      `;
    case 'minimal':
      return baseStyles + `
        .minimal-template h1{text-align:center;color:${accentColor}}
        .minimal-template .contact{text-align:center}
        .minimal-template h2{color:${accentColor};border-bottom:1px solid #eee}
      `;
    case 'technical':
      return baseStyles + `
        .technical-template{display:grid;grid-template-columns:1fr 2fr;gap:20px}
        .technical-template h1{color:${accentColor};grid-column:1/-1}
        .technical-template .contact{grid-column:1/-1;text-align:center}
        .technical-template h2{color:${accentColor}}
      `;
    case 'classic':
    default:
      return baseStyles + `
        .classic-template h1{text-align:center;color:${accentColor};border-bottom:3px solid ${accentColor};padding-bottom:8px}
        .classic-template .contact{text-align:center}
        .classic-template h2{color:${accentColor};text-transform:uppercase;letter-spacing:1px}
      `;
  }
}

function paragraph(text, opts = {}) {
  const runs = Array.isArray(text)
    ? text
    : [new TextRun({ text: String(text || ''), font: 'Calibri', size: 22, ...opts.run })];
  return new Paragraph({ children: runs, spacing: { after: 120 }, ...opts.p });
}

function heading(text) {
  return new Paragraph({
    text: String(text || ''),
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 120, after: 60 },
  });
}

function buildDocxFromResume(resume, template = 'classic', accentColor = '#3FA9F5') {
  const children = [];
  // Header: Name
  children.push(
    paragraph(
      [new TextRun({ text: resume?.personal_info?.full_name || 'Your Name', bold: true, size: 28 })],
      { p: { alignment: AlignmentType.CENTER } }
    )
  );
  // Header: Contact (email | phone | linkedin | website), only if any present
  const contactRuns = [];
  if (resume?.personal_info?.email) contactRuns.push(new TextRun({ text: `${resume.personal_info.email}` }));
  if (resume?.personal_info?.phone || resume?.personal_info?.phone_number) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  |  ' }));
    contactRuns.push(new TextRun({ text: `${resume.personal_info.phone || resume.personal_info.phone_number}` }));
  }
  if (resume?.personal_info?.linkedin) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  |  ' }));
    contactRuns.push(new TextRun({ text: `${resume.personal_info.linkedin}` }));
  }
  if (resume?.personal_info?.website) {
    if (contactRuns.length) contactRuns.push(new TextRun({ text: '  |  ' }));
    contactRuns.push(new TextRun({ text: `${resume.personal_info.website}` }));
  }
  if (contactRuns.length) children.push(paragraph(contactRuns, { p: { alignment: AlignmentType.CENTER } }));

  // Summary (only if present)
  if (resume?.professional_summary && String(resume.professional_summary).trim()) {
    children.push(heading('Summary'));
    children.push(paragraph(resume.professional_summary));
  }

  // Skills (only if non-empty)
  const skills = Array.isArray(resume?.skills) ? resume.skills.filter(Boolean) : [];
  if (skills.length) {
    children.push(heading('Skills'));
    children.push(paragraph(skills.join(', ')));
  }

  // Experience (only if any meaningful entry)
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const expValid = experience.filter(e => e && (e.company || e.position || e.description));
  if (expValid.length) {
    children.push(heading('Experience'));
    expValid.forEach((exp) => {
      children.push(paragraph(`${exp?.company || ''}${exp?.position ? ' | ' + exp.position : ''}`.trim()));
      const dates = `${exp?.start_date || ''} – ${exp?.is_current ? 'Present' : exp?.end_date || ''}`.trim();
      if (dates) children.push(paragraph(dates));
      if (exp?.description) children.push(paragraph(exp.description));
    });
  }

  // Education (only if any)
  const education = Array.isArray(resume?.education) ? resume.education : [];
  const eduValid = education.filter(ed => ed && (ed.degree || ed.institution || ed.graduation_date));
  if (eduValid.length) {
    children.push(heading('Education'));
    eduValid.forEach((edu) => {
      const line1 = `${edu?.degree || ''}${edu?.field ? ' in ' + edu.field : ''}`.trim();
      if (line1) children.push(paragraph(line1));
      const line2 = `${edu?.institution || ''}${edu?.graduation_date ? '  |  ' + edu.graduation_date : ''}${edu?.gpa ? '  |  GPA: ' + edu.gpa : ''}`.trim();
      if (line2) children.push(paragraph(line2));
    });
  }

  // Projects (only if any)
  const projects = Array.isArray(resume?.project) ? resume.project : [];
  const projValid = projects.filter(p => p && (p.name || p.description));
  if (projValid.length) {
    children.push(heading('Projects'));
    projValid.forEach((p) => {
      if (p?.name) children.push(paragraph(p.name));
      if (p?.type) children.push(paragraph(p.type, { run: { size: 20, italic: true } }));
      if (p?.description) children.push(paragraph(p.description));
    });
  }

  // Certifications (only if any)
  const certs = Array.isArray(resume?.certifications) ? resume.certifications : [];
  const certsValid = certs.filter(c => c && (c.name || c.organization));
  if (certsValid.length) {
    children.push(heading('Certifications'));
    certsValid.forEach((cert) => {
      const line = `${cert?.name || ''}${cert?.organization ? ' | ' + cert.organization : ''}`.trim();
      if (line) children.push(paragraph(line));
    });
  }

  const d = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: inch, bottom: inch, left: inch, right: inch },
            size: { orientation: PageOrientation.PORTRAIT },
          },
        },
        children,
      },
    ],
  });
  return d;
}

export const exportDocx = async (req, res) => {
  try {
    const { resume, template, accentColor } = req.body;
    if (!resume || typeof resume !== 'object') {
      return res.status(400).json({ message: 'Missing required fields: resume object' });
    }
    
    // Use template and accent color for styling
    const doc = buildDocxFromResume(resume, template || resume.template, accentColor || resume.accent_color);
    const buffer = await Packer.toBuffer(doc);
    
    const templateName = template || resume.template || 'classic';
    const resumeTitle = resume.title || 'resume';
    const filename = `${resumeTitle}_${templateName}.docx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

function htmlFromResume(resume, template = 'classic', accentColor = '#3FA9F5') {
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const parts = [];
  parts.push(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(resume?.title || 'Resume')}</title>`);
  const templateStyles = getTemplateStyles(template, accentColor);
  parts.push(`<style>@page{size:letter;margin:0.5in}${templateStyles}</style></head><body class="${template}-template">`);
  parts.push(`<h1>${esc(resume?.personal_info?.full_name || 'Your Name')}</h1>`);
  const contact = [];
  if (resume?.personal_info?.email) contact.push(esc(resume.personal_info.email));
  if (resume?.personal_info?.phone) contact.push(esc(resume.personal_info.phone));
  if (resume?.personal_info?.linkedin) contact.push(esc(resume.personal_info.linkedin));
  if (resume?.personal_info?.website) contact.push(esc(resume.personal_info.website));
  if (contact.length) parts.push(`<div class="contact">${contact.join(' | ')}</div>`);
  if (resume?.professional_summary && String(resume.professional_summary).trim()) {
    parts.push(`<div class="section"><h2>Summary</h2><p>${esc(resume.professional_summary)}</p></div>`);
  }
  const skills = Array.isArray(resume?.skills) ? resume.skills.filter(Boolean) : [];
  if (skills.length) parts.push(`<div class="section"><h2>Skills</h2><p>${esc(skills.join(', '))}</p></div>`);
  const exp = Array.isArray(resume?.experience) ? resume.experience.filter(e=>e&&(e.company||e.position||e.description)) : [];
  if (exp.length) {
    parts.push(`<div class="section"><h2>Experience</h2>`);
    parts.push(exp.map(e=>`<p><strong>${esc(e?.company||'')}${e?.position? ' | '+esc(e.position):''}</strong><br>${esc(e?.start_date||'')} – ${esc(e?.is_current?'Present':(e?.end_date||''))}<br>${esc(e?.description||'')}</p>`).join(''));
    parts.push(`</div>`);
  }
  const edu = Array.isArray(resume?.education) ? resume.education.filter(ed=>ed&&(ed.degree||ed.institution||ed.graduation_date)) : [];
  if (edu.length) {
    parts.push(`<div class="section"><h2>Education</h2>`);
    parts.push(edu.map(ed=>`<p><strong>${esc(ed?.degree||'')}${ed?.field? ' in '+esc(ed.field):''}</strong><br>${esc(ed?.institution||'')}${ed?.graduation_date? ' | '+esc(ed.graduation_date):''}${ed?.gpa? ' | GPA: '+esc(ed.gpa):''}</p>`).join(''));
    parts.push(`</div>`);
  }
  const proj = Array.isArray(resume?.project) ? resume.project.filter(p=>p&&(p.name||p.description)) : [];
  if (proj.length) {
    parts.push(`<div class="section"><h2>Projects</h2>`);
    parts.push(proj.map(p=>`<div class="project-item"><p><strong>${esc(p?.name||'')}</strong></p>${p.type ? `<p><em>${esc(p.type)}</em></p>` : ''}<p>${esc(p?.description||'')}</p></div>`).join(''));
    parts.push(`</div>`);
  }
  const certs = Array.isArray(resume?.certifications) ? resume.certifications.filter(c=>c&&(c.name||c.organization)) : [];
  if (certs.length) {
    parts.push(`<div class="section"><h2>Certifications</h2>`);
    parts.push(certs.map(c=>`<p><strong>${esc(c?.name||'')}</strong>${c.organization ? ` | ${esc(c.organization)}` : ''}</p>`).join(''));
    parts.push(`</div>`);
  }
  parts.push(`</body></html>`);
  return parts.join('');
}

export const exportPdf = async (req, res) => {
  try {
    const { resume, previewUrl, template, accentColor } = req.body || {};
    // Prefer exact WYSIWYG by rendering the client preview page when a previewUrl is supplied
    let browser;
    try {
      browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: process.env.CHROMIUM_PATH || process.env.PUPPETEER_EXECUTABLE_PATH });
    } catch (e) {
      try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      } catch (e2) {
        return res.status(503).json({ message: 'PUPPETEER_UNAVAILABLE' });
      }
    }
    const page = await browser.newPage();
    if (previewUrl) {
      await page.goto(previewUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    } else {
      if (!resume || typeof resume !== 'object') {
        await browser.close();
        return res.status(400).json({ message: 'Missing required fields: resume object (or supply previewUrl)' });
      }
      const html = htmlFromResume(resume, template || resume.template, accentColor || resume.accent_color);
      await page.setContent(html, { waitUntil: 'networkidle0' });
    }
    const pdfBuffer = await page.pdf({ format: 'Letter', printBackground: true, margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' } });
    await browser.close();

    const templateName = template || resume.template || 'classic';
    const resumeTitle = resume.title || 'resume';
    const filename = `${resumeTitle}_${templateName}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(pdfBuffer);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
