// Enhanced HTML to DOCX conversion for better ATS compatibility
export const exportHtmlToDocx = (resumeData) => {
  try {
    const htmlContent = generateATSFriendlyHTML(resumeData);
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personal_info?.name || 'Resume'}_Resume.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('HTML to DOCX export failed:', error);
    throw new Error('Failed to export resume. Please try again.');
  }
};

const generateATSFriendlyHTML = (data) => {
  return `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Resume</title>
  <style>
    @page { margin: 1in; }
    body { 
      font-family: 'Calibri', 'Arial', sans-serif; 
      font-size: 11pt; 
      line-height: 1.15; 
      margin: 0; 
      padding: 0;
      color: #000000;
    }
    .header { text-align: center; margin-bottom: 20pt; }
    .name { font-size: 18pt; font-weight: bold; margin-bottom: 6pt; }
    .title { font-size: 12pt; font-style: italic; margin-bottom: 6pt; }
    .contact { font-size: 10pt; margin-bottom: 12pt; }
    .section-header { 
      font-size: 12pt; 
      font-weight: bold; 
      text-transform: uppercase; 
      margin-top: 16pt; 
      margin-bottom: 8pt; 
      border-bottom: 1pt solid #000000;
      padding-bottom: 2pt;
    }
    .job-header { font-weight: bold; margin-top: 8pt; margin-bottom: 2pt; }
    .job-dates { font-style: italic; font-size: 10pt; margin-bottom: 4pt; }
    .description { margin-bottom: 4pt; }
    .skills { margin-bottom: 4pt; }
    ul { margin: 0; padding-left: 20pt; }
    li { margin-bottom: 2pt; }
    p { margin: 0 0 6pt 0; }
  </style>
</head>
<body>
  <div class="header">
    ${data.personal_info?.name ? `<div class="name">${data.personal_info.name}</div>` : ''}
    ${data.personal_info?.title ? `<div class="title">${data.personal_info.title}</div>` : ''}
    <div class="contact">
      ${[
        data.personal_info?.email ? `${data.personal_info.email}` : '',
        data.personal_info?.phone || data.personal_info?.phone_number ? `${data.personal_info.phone || data.personal_info.phone_number}` : '',
        data.personal_info?.linkedin ? `${data.personal_info.linkedin.includes('linkedin.com') ? data.personal_info.linkedin : `linkedin.com/in/${data.personal_info.linkedin}`}` : '',
        data.personal_info?.website ? `${data.personal_info.website}` : ''
      ].filter(Boolean).join(' | ')}
    </div>
  </div>

  ${data.professional_summary ? `
    <div class="section-header">Professional Summary</div>
    <p class="description">${data.professional_summary.replace(/\n/g, '<br>')}</p>
  ` : ''}

  ${data.skills && data.skills.length > 0 ? `
    <div class="section-header">Core Competencies</div>
    <p class="skills">${data.skills.join(' • ')}</p>
  ` : ''}

  ${data.experience && data.experience.length > 0 ? `
    <div class="section-header">Professional Experience</div>
    ${data.experience.map(exp => `
      <div class="job-header">${exp.position} | ${exp.company}</div>
      <div class="job-dates">${exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - ${exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}</div>
      ${exp.description ? `
        <ul>
          ${exp.description.split('\n').filter(desc => desc.trim()).map(desc => `<li>${desc.trim()}</li>`).join('')}
        </ul>
      ` : ''}
    `).join('')}
  ` : ''}

  ${data.education && data.education.length > 0 ? `
    <div class="section-header">Education</div>
    ${data.education.map(edu => `
      <div class="job-header">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
      <p>${edu.institution}${edu.graduation_date ? ` | ${new Date(edu.graduation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}</p>
      ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
    `).join('')}
  ` : ''}

  ${data.project && data.project.length > 0 ? `
    <div class="section-header">Projects</div>
    ${data.project.map(project => `
      <div class="job-header">${project.name}</div>
      ${project.description ? `
        <ul>
          ${project.description.split('\n').filter(desc => desc.trim()).map(desc => `<li>${desc.trim()}</li>`).join('')}
        </ul>
      ` : ''}
    `).join('')}
  ` : ''}
</body>
</html>`;
};