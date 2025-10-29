import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import TechnicalTemplate from './templates/TechnicalTemplate'

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
          <div className="export-frame mx-auto bg-white shadow-md border border-gray-200" style={{ width: 816, minHeight: 1056 }}>
            <div className="p-6">{renderTemplate()}</div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '297mm' }}>
            <div className="p-6 md:p-8">{renderTemplate()}</div>
          </div>
        )}
      </div>

      <style jsx>
        {`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: visible;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .export-frame { 
            background: white; 
            box-shadow: none !important;
            border: none !important;
          }
        }
        `}
      </style>
    </div>
  )
}

export default ResumePreview