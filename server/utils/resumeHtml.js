const DEFAULT_TEMPLATE = 'classic'
const DEFAULT_ACCENT = '#3FA9F5'

const ALLOWED_TEMPLATES = new Set([
  'classic',
  'modern',
  'minimal',
  'minimal-image',
  'technical',
])

const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'projects',
  'certifications',
  'skills',
]

const SECTION_LABELS = {
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  certifications: 'Certifications',
  skills: 'Skills',
}

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

const esc = (input) =>
  String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const sanitizeColor = (color) => {
  if (typeof color !== 'string') return DEFAULT_ACCENT
  const trimmed = color.trim()
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : DEFAULT_ACCENT
}

const formatDate = (value) => {
  if (!value) return ''
  const str = String(value).trim()
  if (!str) return ''
  const [yearPart, monthPart] = str.split('-')
  const year = Number(yearPart)
  if (!Number.isFinite(year)) return esc(str)
  const month = monthPart ? Number(monthPart) - 1 : 0
  const date = new Date(year, Number.isFinite(month) ? month : 0, 1)
  if (Number.isNaN(date.getTime())) return esc(str)
  return esc(
    date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  )
}

const sanitizeLines = (text) => {
  if (typeof text !== 'string') return []
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(esc)
}

const sanitizeInline = (value) => esc(value ?? '')

const sanitizeMultiline = (value) => sanitizeLines(value).join('<br/>')

const renderDescription = (lines, className = 'description') => {
  if (!Array.isArray(lines) || !lines.length) return ''
  if (lines.length === 1) return `<p class="${className}">${lines[0]}</p>`
  return `<ul class="${className}">${lines.map((line) => `<li>${line}</li>`).join('')}</ul>`
}

const buildContactList = (personal) => {
  const items = []
  if (personal.email) items.push(sanitizeInline(personal.email))
  if (personal.phone || personal.phone_number) {
    items.push(sanitizeInline(personal.phone || personal.phone_number))
  }
  if (personal.location) items.push(sanitizeInline(personal.location))
  if (personal.linkedin) items.push(sanitizeInline(personal.linkedin))
  if (personal.website) items.push(sanitizeInline(personal.website))
  return items
}

const buildSectionData = (resume = {}) => {
  const personal = resume?.personal_info || {}

  const experiences = Array.isArray(resume?.experience)
    ? resume.experience
        .filter((exp) => exp && (exp.company || exp.position || exp.description))
        .map((exp) => {
          const lines = sanitizeLines(exp.description)
          const start = formatDate(exp.start_date)
          const end = exp.is_current ? esc('Present') : formatDate(exp.end_date)
          const dates = [start, end].filter(Boolean).join(' – ')
          return {
            position: sanitizeInline(exp.position),
            company: sanitizeInline(exp.company),
            location: sanitizeInline(exp.location),
            dates,
            descriptionLines: lines,
          }
        })
    : []

  const education = Array.isArray(resume?.education)
    ? resume.education
        .filter((edu) => edu && (edu.degree || edu.institution))
        .map((edu) => ({
          degree: sanitizeInline(edu.degree),
          field: sanitizeInline(edu.field),
          institution: sanitizeInline(edu.institution),
          graduationDate: formatDate(edu.graduation_date),
          gpa: sanitizeInline(edu.gpa),
        }))
    : []

  const projects = Array.isArray(resume?.project)
    ? resume.project
        .filter((proj) => proj && (proj.name || proj.description))
        .map((proj) => ({
          name: sanitizeInline(proj.name),
          type: sanitizeInline(proj.type),
          descriptionLines: sanitizeLines(proj.description),
        }))
    : []

  const certifications = Array.isArray(resume?.certification)
    ? resume.certification
        .filter((cert) => cert && (cert.name || cert.organization))
        .map((cert) => ({
          name: sanitizeInline(cert.name),
          organization: sanitizeInline(cert.organization),
          date: formatDate(cert.date),
        }))
    : []

  const skills = Array.isArray(resume?.skills)
    ? resume.skills.filter(Boolean).map((skill) => sanitizeInline(skill))
    : []

  const summary = sanitizeMultiline(resume?.professional_summary)

  const contactList = buildContactList(personal)

  return {
    personal: {
      fullName: sanitizeInline(
        personal.full_name || personal.name || 'Your Name'
      ),
      headline: sanitizeInline(
        personal.profession || resume?.title || personal.title || ''
      ),
      contactList,
    },
    sections: {
      summary,
      experience: experiences,
      education,
      projects,
      certifications,
      skills,
    },
  }
}

const resolveSectionOrder = (resumeSections, sectionData) => {
  const order = Array.isArray(resumeSections)
    ? resumeSections
        .map((section) => {
          if (!section) return null
          if (typeof section === 'string') return section
          if (typeof section === 'object' && section.id) return section.id
          return null
        })
        .filter(Boolean)
    : []

  const existing = new Set()
  const resolved = []

  const appendIfValid = (id) => {
    if (existing.has(id)) return
    if (!DEFAULT_SECTION_ORDER.includes(id)) return
    const data = sectionData[id]
    const hasContent =
      id === 'summary'
        ? Boolean(data)
        : Array.isArray(data)
        ? data.length > 0
        : false
    if (!hasContent) return
    existing.add(id)
    resolved.push(id)
  }

  order.forEach(appendIfValid)
  DEFAULT_SECTION_ORDER.forEach(appendIfValid)

  return resolved
}

const buildContactHtml = (contactList) => {
  if (!Array.isArray(contactList) || !contactList.length) return ''
  return `<div class="contact-line" style="display: flex; justify-content: center; flex-wrap: wrap; column-gap: 1rem; row-gap: 0.25rem;">${contactList
    .map((item) => `<span>${item}</span>`)
    .join('<span class="separator">•</span>')}</div>`
}

const renderClassic = (model, accent, padding) => {
  const { personal, sections, order } = model

  const sectionRenderers = {
    summary: () =>
      sections.summary
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.summary}</h2>
            <p class="section-text">${sections.summary}</p>
          </section>`
        : '',
    experience: () =>
      sections.experience.length
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.experience}</h2>
            ${sections.experience
              .map(
                (exp) => `<div class="item">
                    <div class="item-header">
                      <div>
                        <p class="item-title">${exp.position}</p>
                        <p class="item-subtitle">${[exp.company, exp.location]
                          .filter(Boolean)
                          .join(' · ')}</p>
                      </div>
                      ${
                        exp.dates
                          ? `<p class="item-dates">${exp.dates}</p>`
                          : ''
                      }
                    </div>
                    ${renderDescription(exp.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    education: () =>
      sections.education.length
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.education}</h2>
            ${sections.education
              .map(
                (edu) => `<div class="item narrower">
                    <div class="item-header">
                      <p class="item-title">${[
                        edu.degree,
                        edu.field ? `in ${edu.field}` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}</p>
                      ${
                        edu.graduationDate
                          ? `<p class="item-dates">${edu.graduationDate}</p>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${edu.institution}</p>
                    ${
                      edu.gpa
                        ? `<p class="meta-line">GPA: ${edu.gpa}</p>`
                        : ''
                    }
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    projects: () =>
      sections.projects.length
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.projects}</h2>
            ${sections.projects
              .map(
                (proj) => `<div class="item">
                    <p class="item-title">${proj.name}</p>
                    ${
                      proj.type
                        ? `<p class="item-subtitle">${proj.type}</p>`
                        : ''
                    }
                    ${renderDescription(proj.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    certifications: () =>
      sections.certifications.length
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.certifications}</h2>
            <ul class="list-unstyled">
              ${sections.certifications
                .map(
                  (cert) => `<li class="list-item">
                    <span class="bold">${cert.name}</span>
                    ${
                      cert.organization
                        ? `<span class="muted"> · ${cert.organization}</span>`
                        : ''
                    }
                    ${
                      cert.date
                        ? `<span class="muted"> · ${cert.date}</span>`
                        : ''
                    }
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    skills: () =>
      sections.skills.length
        ? `<section class="section">
            <h2 class="section-title" style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">${SECTION_LABELS.skills}</h2>
            <ul class="skills-grid">
              ${sections.skills
                .map((skill) => `<li class="pill">${skill}</li>`)
                .join('')}
            </ul>
          </section>`
        : '',
  }

  const sectionsHtml = order.map((id) => sectionRenderers[id]?.() || '').join('')

  return `<div class="resume-page classic-template" data-accent="${accent}" style="padding: ${padding || '52px 64px'};">
    <header class="resume-header" style="text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom-width: 2px;">
      <h1 style="font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; margin-bottom: 0.25rem;">${personal.fullName}</h1>
      ${
        personal.headline
          ? `<p class="headline">${personal.headline}</p>`
          : ''
      }
      ${buildContactHtml(personal.contactList)}
    </header>
    ${sectionsHtml}
  </div>`
}

const renderModern = (model, accent, padding) => {
  const { personal, sections, order } = model

  const sectionRenderers = {
    summary: () =>
      sections.summary
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.summary}</h2>
            <p class="section-text">${sections.summary}</p>
          </section>`
        : '',
    experience: () =>
      sections.experience.length
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.experience}</h2>
            ${sections.experience
              .map(
                (exp) => `<div class="item modern">
                    <div class="item-header">
                      <div>
                        <p class="item-title">${exp.position}</p>
                        <p class="item-subtitle">${exp.company}</p>
                      </div>
                      ${
                        exp.dates
                          ? `<span class="chip">${exp.dates}</span>`
                          : ''
                      }
                    </div>
                    ${renderDescription(exp.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    projects: () =>
      sections.projects.length
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.projects}</h2>
            ${sections.projects
              .map(
                (proj) => `<div class="item modern">
                    <p class="item-title">${proj.name}</p>
                    ${
                      proj.type
                        ? `<p class="item-subtitle">${proj.type}</p>`
                        : ''
                    }
                    ${renderDescription(proj.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    certifications: () =>
      sections.certifications.length
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.certifications}</h2>
            <ul class="list-unstyled">
              ${sections.certifications
                .map(
                  (cert) => `<li class="list-item">
                    <span class="bold">${cert.name}</span>
                    ${
                      cert.organization
                        ? `<span class="muted"> · ${cert.organization}</span>`
                        : ''
                    }
                    ${
                      cert.date
                        ? `<span class="muted"> · ${cert.date}</span>`
                        : ''
                    }
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    education: () =>
      sections.education.length
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.education}</h2>
            ${sections.education
              .map(
                (edu) => `<div class="item modern">
                    <div class="item-header">
                      <div>
                        <p class="item-title">${[
                          edu.degree,
                          edu.field ? `in ${edu.field}` : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}</p>
                        <p class="item-subtitle">${edu.institution}</p>
                      </div>
                      ${
                        edu.graduationDate
                          ? `<span class="chip">${edu.graduationDate}</span>`
                          : ''
                      }
                    </div>
                    ${
                      edu.gpa
                        ? `<p class="meta-line">GPA: ${edu.gpa}</p>`
                        : ''
                    }
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    skills: () =>
      sections.skills.length
        ? `<section class="section modern">
            <h2 class="section-title modern">${SECTION_LABELS.skills}</h2>
            <div class="badge-row">
              ${sections.skills
                .map((skill) => `<span class="badge">${skill}</span>`)
                .join('')}
            </div>
          </section>`
        : '',
  }

  const sectionsHtml = order.map((id) => sectionRenderers[id]?.() || '').join('')

  return `<div class="resume-page modern-template" data-accent="${accent}" style="padding: ${padding || '0'};">
    <header class="resume-header modern">
      <h1>${personal.fullName}</h1>
      ${
        personal.headline
          ? `<p class="headline">${personal.headline}</p>`
          : ''
      }
      ${buildContactHtml(personal.contactList)}
    </header>
    <div class="resume-body modern">
      ${sectionsHtml}
    </div>
  </div>`
}

const renderMinimal = (model, accent, padding) => {
  const { personal, sections, order } = model

  const sectionRenderers = {
    summary: () =>
      sections.summary
        ? `<section class="section minimal">
            <p class="section-text">${sections.summary}</p>
          </section>`
        : '',
    experience: () =>
      sections.experience.length
        ? `<section class="section minimal">
            <h2 class="section-title minimal">${SECTION_LABELS.experience}</h2>
            ${sections.experience
              .map(
                (exp) => `<div class="item minimal">
                    <div class="item-header">
                      <p class="item-title">${exp.position}</p>
                      ${
                        exp.dates
                          ? `<p class="item-dates">${exp.dates}</p>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${exp.company}</p>
                    ${renderDescription(exp.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    projects: () =>
      sections.projects.length
        ? `<section class="section minimal">
            <h2 class="section-title minimal">${SECTION_LABELS.projects}</h2>
            ${sections.projects
              .map(
                (proj) => `<div class="item minimal">
                    <p class="item-title">${proj.name}</p>
                    ${
                      proj.type
                        ? `<p class="meta-line">${proj.type}</p>`
                        : ''
                    }
                    ${renderDescription(proj.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    certifications: () =>
      sections.certifications.length
        ? `<section class="section minimal">
            <h2 class="section-title minimal">${SECTION_LABELS.certifications}</h2>
            <ul class="list-unstyled">
              ${sections.certifications
                .map(
                  (cert) => `<li class="list-item">
                    <span class="bold">${cert.name}</span>
                    ${
                      cert.organization
                        ? `<span class="muted"> · ${cert.organization}</span>`
                        : ''
                    }
                    ${
                      cert.date
                        ? `<span class="muted"> · ${cert.date}</span>`
                        : ''
                    }
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    education: () =>
      sections.education.length
        ? `<section class="section minimal">
            <h2 class="section-title minimal">${SECTION_LABELS.education}</h2>
            ${sections.education
              .map(
                (edu) => `<div class="item minimal">
                    <div class="item-header">
                      <p class="item-title">${[
                        edu.degree,
                        edu.field ? `in ${edu.field}` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}</p>
                      ${
                        edu.graduationDate
                          ? `<p class="item-dates">${edu.graduationDate}</p>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${edu.institution}</p>
                    ${
                      edu.gpa
                        ? `<p class="meta-line">GPA: ${edu.gpa}</p>`
                        : ''
                    }
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    skills: () =>
      sections.skills.length
        ? `<section class="section minimal">
            <h2 class="section-title minimal">${SECTION_LABELS.skills}</h2>
            <p class="section-text">${sections.skills.join(' · ')}</p>
          </section>`
        : '',
  }

  const sectionsHtml = order.map((id) => sectionRenderers[id]?.() || '').join('')

  return `<div class="resume-page minimal-template" data-accent="${accent}" style="padding: ${padding || '56px 64px'};">
    <header class="resume-header minimal">
      <h1>${personal.fullName}</h1>
      ${buildContactHtml(personal.contactList)}
    </header>
    ${sectionsHtml}
  </div>`
}

const renderMinimalImage = (model, accent, padding) => {
  const { personal, sections, order } = model
  const mainIds = order.filter((id) =>
    ['summary', 'experience', 'projects'].includes(id)
  )
  const asideIds = order.filter((id) =>
    ['education', 'skills', 'certifications'].includes(id)
  )

  const sectionRenderers = {
    summary: () =>
      sections.summary
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.summary}</h2>
            <p class="section-text">${sections.summary}</p>
          </section>`
        : '',
    experience: () =>
      sections.experience.length
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.experience}</h2>
            ${sections.experience
              .map(
                (exp) => `<div class="item mi">
                    <div class="item-header">
                      <p class="item-title">${exp.position}</p>
                      ${
                        exp.dates
                          ? `<p class="item-dates">${exp.dates}</p>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${exp.company}</p>
                    <div class="description">
                      ${renderDescription(exp.descriptionLines, 'description list')}
                    </div>
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    projects: () =>
      sections.projects.length
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.projects}</h2>
            ${sections.projects
              .map(
                (proj) => `<div class="item mi">
                    <p class="item-title">${proj.name}</p>
                    ${
                      proj.type
                        ? `<p class="meta-line">${proj.type}</p>`
                        : ''
                    }
                    <div class="description">
                      ${renderDescription(proj.descriptionLines, 'description list')}
                    </div>
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    education: () =>
      sections.education.length
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.education}</h2>
            <ul class="list-unstyled tight">
              ${sections.education
                .map(
                  (edu) => `<li class="list-item">
                    <span class="bold">${edu.degree}</span>
                    ${
                      edu.graduationDate
                        ? `<span class="muted"> · ${edu.graduationDate}</span>`
                        : ''
                    }
                    <div class="muted">${edu.institution}</div>
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    certifications: () =>
      sections.certifications.length
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.certifications}</h2>
            <ul class="list-unstyled tight">
              ${sections.certifications
                .map(
                  (cert) => `<li class="list-item">
                    <span class="bold">${cert.name}</span>
                    ${
                      cert.date
                        ? `<span class="muted"> · ${cert.date}</span>`
                        : ''
                    }
                    <div class="muted">${cert.organization}</div>
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    skills: () =>
      sections.skills.length
        ? `<section class="section mi">
            <h2 class="section-title mi">${SECTION_LABELS.skills}</h2>
            <ul class="list-unstyled tight">
              ${sections.skills.map((skill) => `<li>${skill}</li>`).join('')}
            </ul>
          </section>`
        : '',
  }

  const renderGroup = (ids) =>
    ids.map((id) => sectionRenderers[id]?.() || '').join('')

  return `<div class="resume-page minimal-image-template" data-accent="${accent}" style="padding: ${padding || '0'};">
    <div class="mi-grid">
      <aside class="mi-sidebar">
        <h1>${personal.fullName}</h1>
        ${buildContactHtml(personal.contactList)}
        ${renderGroup(asideIds)}
      </aside>
      <main class="mi-main">
        ${renderGroup(mainIds)}
      </main>
    </div>
  </div>`
}

const chunkArray = (items, size) => {
  const result = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

const renderTechnical = (model, accent, padding) => {
  const { personal, sections, order } = model

  const sectionRenderers = {
    summary: () =>
      sections.summary
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.summary}</h2>
            <p class="section-text">${sections.summary}</p>
          </section>`
        : '',
    experience: () =>
      sections.experience.length
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.experience}</h2>
            ${sections.experience
              .map(
                (exp) => `<div class="item technical">
                    <div class="item-header">
                      <p class="item-title">${exp.position}</p>
                      ${
                        exp.dates
                          ? `<span class="chip">${exp.dates}</span>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${exp.company}</p>
                    ${renderDescription(exp.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    projects: () =>
      sections.projects.length
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.projects}</h2>
            ${sections.projects
              .map(
                (proj) => `<div class="item technical">
                    <div class="item-header">
                      <p class="item-title">${proj.name}</p>
                      ${
                        proj.type
                          ? `<span class="chip subtle">${proj.type}</span>`
                          : ''
                      }
                    </div>
                    ${renderDescription(proj.descriptionLines)}
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    education: () =>
      sections.education.length
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.education}</h2>
            ${sections.education
              .map(
                (edu) => `<div class="item technical">
                    <div class="item-header">
                      <p class="item-title">${[
                        edu.degree,
                        edu.field ? `in ${edu.field}` : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}</p>
                      ${
                        edu.graduationDate
                          ? `<span class="chip subtle">${edu.graduationDate}</span>`
                          : ''
                      }
                    </div>
                    <p class="item-subtitle">${edu.institution}</p>
                    ${
                      edu.gpa
                        ? `<p class="meta-line">GPA: ${edu.gpa}</p>`
                        : ''
                    }
                  </div>`
              )
              .join('')}
          </section>`
        : '',
    certifications: () =>
      sections.certifications.length
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.certifications}</h2>
            <ul class="list-unstyled">
              ${sections.certifications
                .map(
                  (cert) => `<li class="list-item">
                    <span class="bold">${cert.name}</span>
                    ${
                      cert.organization
                        ? `<span class="muted"> · ${cert.organization}</span>`
                        : ''
                    }
                    ${
                      cert.date
                        ? `<span class="muted"> · ${cert.date}</span>`
                        : ''
                    }
                  </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '',
    skills: () =>
      sections.skills.length
        ? `<section class="section technical">
            <h2 class="section-title technical">${SECTION_LABELS.skills}</h2>
            <div class="skills-table">
              ${chunkArray(sections.skills, 3)
                .map(
                  (row) => `<div class="skills-row">
                    ${row
                      .map((skill) => `<span class="badge subtle">${skill}</span>`)
                      .join('')}
                  </div>`
                )
                .join('')}
            </div>
          </section>`
        : '',
  }

  const sectionsHtml = order.map((id) => sectionRenderers[id]?.() || '').join('')

  return `<div class="resume-page technical-template" data-accent="${accent}" style="padding: ${padding || '48px 56px'};">
    <header class="resume-header technical">
      <h1>${personal.fullName}</h1>
      ${buildContactHtml(personal.contactList)}
    </header>
    ${sectionsHtml}
  </div>`
}

const getTemplateStyles = (template, padding) => {
  const base = `
    *{box-sizing:border-box}
    html,body{margin:0;padding:0;background:#f3f4f6;color:#1f2937;font-family:'Inter','Segoe UI',Arial,sans-serif}
    @page{size:Letter;margin:0.5in}
    body{display:flex;justify-content:center;padding:40px 0}
    .resume-page{width:816px;min-height:1056px;background:#fff;padding:${padding || '52px 64px'};box-shadow:0 12px 40px rgba(15,23,42,0.08);border-radius:16px}
    h1{margin:0;font-size:32px;font-weight:700;letter-spacing:-0.01em;color:#0f172a}
    .headline{margin-top:6px;font-size:15px;color:#334155}
    .contact-line{margin-top:10px;display:flex;flex-wrap:wrap;gap:10px;font-size:13px;color:#475569}
    .separator{opacity:0.5}
    .section{margin-bottom:32px;break-inside:avoid-page}
    .section-title{font-size:13px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;margin-bottom:12px;color:var(--accent-color,#3FA9F5); break-after: avoid-page;}
    .section-text{font-size:14px;line-height:1.6;color:#1f2937}
    .item{margin-bottom:18px;padding-left:16px;border-left:2px solid rgba(15,23,42,0.08); break-inside: avoid-page;}
    .item-header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:4px}
    .item-title{margin:0;font-size:16px;font-weight:600;color:#0f172a}
    .item-subtitle{margin:2px 0;font-size:14px;font-weight:500;color:var(--accent-color,#3FA9F5)}
    .item-dates{margin:0;font-size:12px;color:#475569;white-space:nowrap}
    .meta-line{font-size:12px;color:#475569;margin:6px 0 0 0}
    .description{font-size:13px;color:#1f2937;line-height:1.55;margin-top:8px}
    .description ul{margin:0;padding-left:18px}
    .description li{margin-bottom:6px}
    .description.list{padding-left:0;border:none}
    .list-unstyled{margin:0;padding:0;list-style:none}
    .list-unstyled.tight .list-item{margin-bottom:10px}
    .list-item{margin-bottom:8px;font-size:13px;color:#1f2937}
    .bold{font-weight:600;color:#0f172a}
    .muted{color:#475569;font-size:12px}
    .skills-grid{display:flex;flex-wrap:wrap;gap:10px;padding:0;list-style:none}
    .pill{background:rgba(63,169,245,0.12);color:var(--accent-color,#3FA9F5);padding:6px 12px;border-radius:999px;font-size:13px;font-weight:500}
    .badge-row{display:flex;flex-wrap:wrap;gap:10px}
    .badge{background:rgba(15,23,42,0.05);color:#0f172a;padding:6px 14px;border-radius:999px;font-size:13px}
    .badge.subtle,.chip.subtle{background:rgba(15,23,42,0.08);color:#334155}
    .chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:500;color:#fff;background:var(--accent-color,#3FA9F5)}
    .chip.subtle{color:#1f2937}
  `

  const templateSpecific = {
    classic: `
      .classic-template{--accent-color:inherit}
      .classic-template .resume-header{border-bottom:3px solid var(--accent-color,#3FA9F5);padding-bottom:24px;margin-bottom:32px;text-align:center}
      .classic-template .item{border-left:2px solid rgba(15,23,42,0.08)}
      .classic-template .section-title{border-bottom:1px solid rgba(15,23,42,0.12);padding-bottom:6px}
    `,
    modern: `
      .modern-template{padding:0;border-radius:20px;overflow:hidden}
      .modern-template .resume-header{padding:48px 56px 32px;background:var(--accent-color,#3FA9F5);color:#fff}
      .modern-template .resume-header .headline{color:rgba(255,255,255,0.85)}
      .modern-template .resume-header .contact-line{color:rgba(255,255,255,0.85)}
      .modern-template .resume-header .separator{opacity:0.65}
      .modern-template .resume-body{padding:40px 56px 48px}
      .modern-template .section-title{color:#0f172a;text-transform:none;font-size:18px;letter-spacing:0;font-weight:500;margin-bottom:16px;border-bottom:1px solid rgba(15,23,42,0.1);padding-bottom:12px}
      .modern-template .item{border:none;padding-left:0}
    `,
    minimal: `
      .minimal-template{padding:56px 64px;font-weight:300}
      .minimal-template .resume-header{margin-bottom:28px}
      .minimal-template .section{margin-bottom:36px}
      .minimal-template .section-title{letter-spacing:0.22em;font-size:12px;font-weight:500}
      .minimal-template .item{border:none;padding-left:0;margin-bottom:20px}
      .minimal-template .item-title{font-weight:500}
      .minimal-template .section-text{font-size:14px}
    `,
    'minimal-image': `
      .minimal-image-template{padding:0}
      .mi-grid{display:grid;grid-template-columns:280px 1fr;min-height:1056px}
      .mi-sidebar{background:#111827;color:#f8fafc;padding:44px 32px}
      .mi-sidebar h1{color:#f8fafc;font-size:28px;margin-bottom:16px}
      .mi-sidebar .contact-line{color:rgba(248,250,252,0.8);margin-bottom:24px}
      .mi-sidebar .section-title{color:#f8fafc;font-size:12px;letter-spacing:0.24em}
      .mi-sidebar .section{margin-bottom:24px}
      .mi-sidebar .list-item,.mi-sidebar .muted{color:rgba(248,250,252,0.85)}
      .mi-main{padding:52px 56px;background:#fff}
      .mi-main .section-title{letter-spacing:0.24em;font-size:12px}
      .mi-main .item{border:none;padding-left:0;border-bottom:1px solid rgba(15,23,42,0.08);padding-bottom:18px;margin-bottom:24px}
      .mi-main .item:last-child{border-bottom:none}
      .mi-main .description ul{padding-left:20px}
    `,
    technical: `
      .technical-template{padding:48px 56px}
      .technical-template .resume-header{border-bottom:2px solid var(--accent-color,#3FA9F5);padding-bottom:20px;margin-bottom:28px}
      .technical-template .section{margin-bottom:28px}
      .technical-template .section-title{letter-spacing:0.24em;font-size:12px}
      .technical-template .item{border-left:2px solid var(--accent-color,#3FA9F5);padding-left:18px}
      .technical-template .skills-table{display:flex;flex-direction:column;gap:8px}
      .technical-template .skills-row{display:flex;flex-wrap:wrap;gap:10px}
      .technical-template .badge.subtle{background:rgba(15,23,42,0.06);color:#0f172a}
    `,
  }

  return base + (templateSpecific[template] || templateSpecific.classic)
}

export const generateResumeHtml = (
  resume = {},
  template = DEFAULT_TEMPLATE,
  accentColor = DEFAULT_ACCENT,
  padding
) => {
  const chosenTemplate = ALLOWED_TEMPLATES.has(template)
    ? template
    : DEFAULT_TEMPLATE
  const accent = sanitizeColor(accentColor)
  const { personal, sections } = buildSectionData(resume)
  const order = resolveSectionOrder(resume?.sections, sections)

  const model = { personal, sections, order }

  const templateRenderers = {
    classic: renderClassic,
    modern: renderModern,
    minimal: renderMinimal,
    'minimal-image': renderMinimalImage,
    technical: renderTechnical,
  }

  const body = templateRenderers[chosenTemplate](model, accent, padding)
  const styles = getTemplateStyles(chosenTemplate, padding)

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <title>${esc(resume?.title || 'Resume')}</title>
      <style>${styles}</style>
    </head>
    <body style="--accent-color:${accent}">
      ${body}
    </body>
  </html>`
}
