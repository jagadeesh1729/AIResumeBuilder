import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import TechnicalTemplate from './templates/TechnicalTemplate'
import './ResumePreview.css'

const ResumePreview = ({ data, template, accentColor, sections, classes = "", exportLayout = false }) => {

    const renderTemplate = () => {
        const props = { data, accentColor, sections }
        switch (template) {
            case "modern":
                return <ModernTemplate {...props} />;
            case "minimal":
                return <MinimalTemplate {...props} />;
            case "minimal-image":
                return <MinimalImageTemplate {...props} />;
            case "technical":
                return <TechnicalTemplate {...props} />;
            case "classic":
            default:
                return <ClassicTemplate {...props} />;
        }
    }

  return (
    <div className='w-full h-full'>
      <div id="resume-preview" className={`print:shadow-none print:border-none ${classes}`}>
        {exportLayout ? (
          <div className="export-frame">
            <div className="p-6">{renderTemplate()}</div>
          </div>
        ) : (
          <div className="preview-container">
            <div className="p-6 md:p-8">{renderTemplate()}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumePreview
