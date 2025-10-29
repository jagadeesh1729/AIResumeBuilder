import React from 'react';
import { useSelector } from 'react-redux';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';
import './ResumePreview.css';

const ResumePreview = ({ classes = "", exportLayout = false }) => {
    const { resume, padding } = useSelector(state => state.resume);
    const { template, accent_color: accentColor, sections } = resume;

    const renderTemplate = () => {
        const props = { data: resume, accentColor, sections };
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
            <div style={{ padding }}>{renderTemplate()}</div>
          </div>
        ) : (
          <div className="preview-container">
            <div style={{ padding }} className="md:p-8">{renderTemplate()}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumePreview;
