import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview: "Traditional format with clear sections and professional typography",
            features: ["Clean layout", "Professional look", "ATS-friendly"]
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategic color usage and contemporary styling",
            features: ["Color header", "Modern fonts", "Visual appeal"]
        },
        {
            id: "technical",
            name: "Technical",
            preview: "Two-column layout perfect for highlighting technical skills",
            features: ["Two columns", "Skills focus", "Tech-oriented"]
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Clean design with optional profile image placement",
            features: ["Photo support", "Minimal style", "Clean lines"]
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra-clean design that emphasizes content over decoration",
            features: ["Minimalist", "Content-focused", "Simple"]
        },
    ]

  return (
    <div className='relative'>
      <button onClick={()=> setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-[var(--brand-primary)] bg-gradient-to-br from-[#3FA9F510] to-[#3FA9F522] ring-[var(--brand-primary)] hover:ring transition-all px-3 py-2 rounded-lg'>
        <Layout size={14} /> <span className='max-sm:hidden'>Template</span>
      </button>
      {isOpen && (
        <div className='absolute top-full w-80 p-3 mt-2 space-y-3 z-50 bg-white rounded-md border border-gray-200 shadow-lg max-h-96 overflow-y-auto'>
            {templates.map((template)=>(
                <div key={template.id} onClick={()=> {onChange(template.id); setIsOpen(false)}} className={`relative p-4 border rounded-md cursor-pointer transition-all hover:shadow-sm ${selectedTemplate === template.id ?
                    "border-[var(--brand-primary)] bg-[#3FA9F522] shadow-sm"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}>
                    {selectedTemplate === template.id && (
                        <div className="absolute top-3 right-3">
                            <div className='size-5 bg-[var(--brand-primary)] rounded-full flex items-center justify-center'>
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h4 className='font-semibold text-gray-800'>{template.name}</h4>
                        <p className='text-xs text-gray-600 leading-relaxed'>{template.preview}</p>
                        <div className='flex flex-wrap gap-1 mt-2'>
                            {template.features.map((feature, index) => (
                                <span key={index} className='text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full'>
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector