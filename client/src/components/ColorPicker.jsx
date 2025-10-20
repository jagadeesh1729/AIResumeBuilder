import { Check, Palette } from 'lucide-react';
import React, { useState } from 'react'

const ColorPicker = ({selectedColor, onChange }) => {
    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Indigo", value: "#6366F1" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Emerald", value: "#059669" },
        { name: "Cyan", value: "#06B6D4" },
        { name: "Amber", value: "#F59E0B" },
        { name: "Rose", value: "#F43F5E" },
        { name: "Slate", value: "#64748B" },
        { name: "Navy", value: "#1E3A8A" },
        { name: "Crimson", value: "#DC2626" },
        { name: "Forest", value: "#166534" }
    ]

    const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div className='relative'>
      <button 
        onClick={()=> setIsOpen(!isOpen)} 
        className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'
      >
        <div 
          className="w-4 h-4 rounded-full border border-gray-300" 
          style={{backgroundColor: selectedColor}}
        />
        <span className="max-sm:hidden">Color</span>
      </button>
      {isOpen && (
        <div className='grid grid-cols-4 w-64 gap-2 absolute top-full left-0 p-3 mt-2 z-50 bg-white rounded-md border border-gray-200 shadow-lg'>
            {colors.map((color)=>(
                <div 
                  key={color.value} 
                  className='relative cursor-pointer group flex flex-col items-center' 
                  onClick={()=> {onChange(color.value); setIsOpen(false)}}
                >
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-gray-400 transition-all hover:scale-110" 
                      style={{backgroundColor : color.value}}
                    >
                      {selectedColor === color.value && (
                        <div className='w-full h-full flex items-center justify-center'>
                            <Check className="size-4 text-white drop-shadow-sm"/>
                        </div>
                      )}
                    </div>
                    <p className='text-xs text-center mt-1 text-gray-600 group-hover:text-gray-800 transition-colors'>{color.name}</p>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ColorPicker