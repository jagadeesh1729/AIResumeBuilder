import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const CertificationForm = ({ data, onChange }) => {

const addCertification = () =>{
    const newCertification = {
        name: "",
        organization: "",
        date: "",
    };
    onChange([...data, newCertification])
}

const removeCertification = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateCertification = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Certifications </h3>
            <p className='text-sm text-gray-500'>Add your certifications</p>
        </div>
        <button onClick={addCertification} className='flex items-center gap-2 px-3 py-1 text-sm bg-[#3FA9F520] text-[var(--brand-primary)] rounded-lg hover:bg-[#3FA9F533] transition-colors'>
            <Plus className="size-4"/>
            Add Certification
        </button>
      </div>


        <div className='space-y-4 mt-6'>
            {data.map((certification, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className='flex justify-between items-start'>
                        <h4>Certification #{index + 1}</h4>
                        <button onClick={()=> removeCertification(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid gap-3'>

                        <input value={certification.name || ""} onChange={(e)=>updateCertification(index, "name", e.target.value)} type="text" placeholder="Certification Name" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={certification.organization || ""} onChange={(e)=>updateCertification(index, "organization", e.target.value)} type="text" placeholder="Issuing Organization" className="px-3 py-2 text-sm rounded-lg"/>

                        <input value={certification.date || ""} onChange={(e)=>updateCertification(index, "date", e.target.value)} type="date" placeholder="Date" className="px-3 py-2 text-sm rounded-lg"/>

                    </div>


                </div>
            ))}
        </div>

    </div>
  )
}

export default CertificationForm
