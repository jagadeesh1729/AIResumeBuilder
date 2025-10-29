import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import TechnicalTemplate from './templates/TechnicalTemplate'

const ResumePreview = ({ data, template, accentColor, sections, classes = "", exportLayout = false, showGuides = true }) => {

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
          // Export layout uses a fixed frame. Keep as-is, but match A4 padding for on-screen consistency
          <div
            className="export-frame a4-page mx-auto bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden"
            style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}
          >
            {renderTemplate()}
          </div>
        ) : (
          // Screen preview with A4 sizing and optional page-break guides
          <div className="relative">
            <div
              className="a4-page bg-white border border-gray-200 rounded-lg overflow-hidden"
              style={{ width: '210mm', minHeight: '297mm', padding: '15mm' }}
            >
              {renderTemplate()}
            </div>
            {showGuides && (
              <>
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{ top: '297mm', height: 2, borderTop: '2px dashed rgba(0,0,0,0.2)' }}
                />
                <div
                  className="absolute -right-12"
                  style={{ top: '297mm', transform: 'translateY(-50%)' }}
                >
                  <span className="bg-gray-100 px-2 py-1 text-xs text-gray-600 rounded shadow-sm border border-gray-200">A4 Break</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>
        {`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
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
          /* A4 page wrapper: remove screen padding and borders for print, rely on @page margins */
          #resume-preview .a4-page {
            width: auto !important;
            min-height: auto !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
          /* Avoid breaking important blocks across pages */
          #resume-preview section { break-inside: avoid-page; page-break-inside: avoid; }
          #resume-preview section > h2 { break-after: avoid-page; page-break-after: avoid; }
          /* Keep header with first block of content */
          #resume-preview section > h2 + * { break-before: avoid-page; page-break-before: avoid; }
          #resume-preview .avoid-break { break-inside: avoid-page; page-break-inside: avoid; }
          #resume-preview table, #resume-preview tr, #resume-preview td, #resume-preview th { break-inside: avoid-page; page-break-inside: avoid; }
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
