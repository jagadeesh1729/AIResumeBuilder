import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Award, Briefcase, CheckCircle, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, FileText, FolderIcon, GraduationCap, GripVertical, Save, Share2Icon, Sparkles, User } from 'lucide-react'
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import CertificationForm from '../components/CertificationForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import useClickOutside from '../hooks/useClickOutside'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    certifications: [],
    template: "classic",
    accent_color: "#3FA9F5",
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const exportRef = useRef(null)
  const previewRef = useRef(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const initialSections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "certifications", name: "Certifications", icon: Award },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const sections = resumeData?.sections || initialSections
  const activeSection = sections[activeSectionIndex]

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    const currentId = activeSection?.id
    setResumeData({ ...resumeData, sections: items })
    if (currentId) {
      const nextIndex = items.findIndex(s => s.id === currentId)
      if (nextIndex >= 0) setActiveSectionIndex(nextIndex)
    }
  }

  const loadExistingResume = async () => {
    if (!resumeId) return;
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        // Merge with defaults to ensure arrays/objects exist for all sections
        setResumeData(prev => ({
          ...prev,
          ...data.resume,
          personal_info: { ...(prev.personal_info || {}), ...(data.resume.personal_info || {}) },
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          project: data.resume.project || [],
          skills: data.resume.skills || [],
          certifications: data.resume.certifications || [],
          sections: Array.isArray(data.resume.sections) && data.resume.sections.length ? data.resume.sections : (prev.sections || initialSections),
          template: data.resume.template || prev.template || "classic",
          accent_color: data.resume.accent_color || prev.accent_color || "#3FA9F5",
          public: typeof data.resume.public === 'boolean' ? data.resume.public : (prev.public ?? false)
        }))
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      loadExistingResume()
    }
  }, [resumeId, token])

  useEffect(() => {
    if (resumeData?.title) document.title = resumeData.title
  }, [resumeData?.title])

  useClickOutside(exportRef, () => setExportOpen(false))
  useClickOutside(previewRef, () => setPreviewOpen(false))

  const isSectionComplete = (sectionId) => {
    switch (sectionId) {
      case 'personal': return (resumeData.personal_info?.full_name || resumeData.personal_info?.name) && resumeData.personal_info?.email
      case 'summary': return resumeData.professional_summary?.length > 50
      case 'experience': return resumeData.experience?.length > 0
      case 'education': return resumeData.education?.length > 0
      case 'projects': return resumeData.project?.length > 0
      case 'certifications': return resumeData.certifications?.length > 0
      case 'skills': return resumeData.skills?.length > 0
      default: return false
    }
  }

  const saveResume = async (showToast = true) => {
    try {
      setAutoSaving(true)
      let updatedResumeData = structuredClone(resumeData)

      if (typeof resumeData.personal_info?.image === 'object') {
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify(updatedResumeData))

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      if (showToast) toast.success(data.message)
      setLastSaved(new Date())
    } catch (error) {
      console.error("Error saving resume:", error)
      if (showToast) toast.error("Failed to save resume")
    } finally {
      setAutoSaving(false)
    }
  }

  const debouncedSave = useCallback(
    debounce(() => saveResume(false), 2000),
    [resumeData]
  )

  useEffect(() => {
    if (resumeData._id) {
      debouncedSave()
    }
  }, [resumeData, debouncedSave])

  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))

      const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })

      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.success('Resume link copied to clipboard!')
    }
  }

  const downloadResume = () => {
    window.print()
  }

  const canExport = Boolean(resumeData?._id)

  const exportDocx = async () => {
    try {
      if (!token) {
        toast.error('Please login to export')
        return
      }
      if (!canExport) {
        toast.error('Please save the resume first')
        return
      }
      
      // Include template and accent color in the export request
      const exportData = {
        resume: resumeData,
        template: resumeData.template,
        accentColor: resumeData.accent_color
      }
      
      const { data } = await api.post('/api/export/docx', exportData, { 
        responseType: 'blob', 
        headers: { Authorization: token } 
      })
      
      const url = URL.createObjectURL(new Blob([data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData?.title || 'resume'}_${resumeData.template}.docx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('DOCX exported successfully!')
    } catch (err) {
      console.error('DOCX export failed', err)
      toast.error('DOCX export failed. Please try again later.')
    }
  }

  const exportPdf = async () => {
    try {
      if (!token) {
        toast.error('Please login to export')
        return
      }
      if (!canExport) {
        toast.error('Please save the resume first')
        return
      }
      
      const frontendOrigin = window.location.origin
      const previewUrl = `${frontendOrigin}/view/${resumeId}?t=${encodeURIComponent(resumeData.template)}&c=${encodeURIComponent(resumeData.accent_color || '')}`
        
      const payload = {
        resume: resumeData,
        template: resumeData.template,
        accentColor: resumeData.accent_color,
        ...(previewUrl && { previewUrl })
      }
      
      const response = await api.post('/api/export/pdf', payload, { 
        responseType: 'blob', 
        validateStatus: () => true, 
        headers: { Authorization: token } 
      })
      
      if (response.status !== 200) {
        toast.error('Server PDF export unavailable. Using print to PDF.')
        return downloadResume()
      }
      
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData?.title || 'resume'}_${resumeData.template}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('PDF exported successfully!')
    } catch (err) {
      console.error('PDF export failed', err)
      toast.error('PDF export failed. Using print to PDF.')
      downloadResume()
    }
  }

  const previewPdf = async () => {
    try {
      if (!token) {
        toast.error('Please login to preview server PDF')
        return downloadResume()
      }
      if (!canExport) {
        toast.error('Please save the resume first')
        return downloadResume()
      }
      
      const frontendOrigin = window.location.origin
      const previewUrl = `${frontendOrigin}/view/${resumeId}?t=${encodeURIComponent(resumeData.template)}&c=${encodeURIComponent(resumeData.accent_color || '')}`
        
      const payload = {
        resume: resumeData,
        template: resumeData.template,
        accentColor: resumeData.accent_color,
        ...(previewUrl && { previewUrl })
      }
      
      const response = await api.post('/api/export/pdf', payload, { 
        responseType: 'blob', 
        validateStatus: () => true, 
        headers: { Authorization: token } 
      })
      
      if (response.status !== 200) {
        toast.error('Server PDF preview unavailable. Opening print preview.')
        return downloadResume()
      }
      
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      window.open(url, '_blank', 'noopener')
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      console.error('PDF preview failed', err)
      toast.error('PDF preview failed. Opening print preview.')
      downloadResume()
    }
  }

  const previewDocx = async () => {
    try {
      toast.error('DOCX preview is not supported by browsers. Downloading instead.')
      await exportDocx()
    } catch (err) {
      console.error('DOCX preview failed', err)
      toast.error('DOCX preview failed. Try export instead.')
    }
  }

  if (!resumeData?._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resume Not Found</h2>
          <p className="text-gray-600 mb-6">The resume you are looking for does not exist or you do not have permission to view it.</p>
          <Link to="/app/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon size={20} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <input
              type="text"
              value={resumeData.title}
              onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
              className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-300 focus:rounded px-2 py-1"
              placeholder="Untitled Resume"
            />
          </div>

          <div className="flex items-center gap-3">
            {autoSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Saving...
              </div>
            )}
            
            {lastSaved && !autoSaving && (
              <div className="text-sm text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}

            <button
              onClick={() => saveResume()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <div className="relative" ref={previewRef}>
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon size={16} />
                <span className="hidden sm:inline">Preview</span>
              </button>
              
              {previewOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {previewPdf(); setPreviewOpen(false)}}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Preview PDF
                  </button>
                  <button
                    onClick={() => {previewDocx(); setPreviewOpen(false)}}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Preview DOCX
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              
              {exportOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {exportPdf(); setExportOpen(false)}}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {exportDocx(); setExportOpen(false)}}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Export as DOCX
                  </button>
                  <button
                    onClick={() => {downloadResume(); setExportOpen(false)}}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <DownloadIcon size={16} />
                    Print/Save as PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={changeResumeVisibility}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                resumeData.public 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Share2Icon size={16} />
              <span className="hidden sm:inline">{resumeData.public ? 'Public' : 'Private'}</span>
            </button>

            {resumeData.public && (
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2Icon size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className=" mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Section Navigation */}
            <div className="border-b border-gray-200 p-4">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <GripVertical size={14} className="text-gray-400" />
                <span role="img" aria-label="drag">↔️</span> Drag and drop sections to reorder them in your resume
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="section-tabs" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex items-center gap-2 overflow-x-auto pb-2"
                    >
                      {sections.map((section, index) => {
                        const Icon = section.icon
                        const isActive = index === activeSectionIndex
                        const isComplete = isSectionComplete(section.id)
                        return (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(dragProvided) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                className="flex items-center"
                              >
                                <button
                                  onClick={() => setActiveSectionIndex(index)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                                    isActive 
                                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  <Icon size={16} />
                                  <span className="text-sm">{section.name}</span>
                                  {isComplete && (
                                    <CheckCircle size={14} className="text-green-500" />
                                  )}
                                </button>
                                <span
                                  {...dragProvided.dragHandleProps}
                                  className="px-1 cursor-grab text-gray-400 hover:text-gray-600 select-none"
                                  title="Drag to reorder"
                                >
                                  <GripVertical size={16} />
                                </span>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm 
                    data={resumeData.personal_info} 
                    onChange={(data) => setResumeData({...resumeData, personal_info: data})} 
                  />
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm 
                    data={resumeData.professional_summary} 
                    onChange={(data) => setResumeData({...resumeData, professional_summary: data})} 
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm 
                    data={resumeData.experience} 
                    onChange={(data) => setResumeData({...resumeData, experience: data})} 
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm 
                    data={resumeData.education} 
                    onChange={(data) => setResumeData({...resumeData, education: data})} 
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm 
                    data={resumeData.project} 
                    onChange={(data) => setResumeData({...resumeData, project: data})} 
                  />
                )}
                {activeSection.id === "certifications" && (
                  <CertificationForm
                    data={resumeData.certifications}
                    onChange={(data) => setResumeData({...resumeData, certifications: data})}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm 
                    data={resumeData.skills} 
                    onChange={(data) => setResumeData({...resumeData, skills: data})} 
                  />
                )}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <span className="text-sm text-gray-500">
                  {activeSectionIndex + 1} of {sections.length}
                </span>
                
                <button
                  onClick={() => setActiveSectionIndex(Math.min(sections.length - 1, activeSectionIndex + 1))}
                  disabled={activeSectionIndex === sections.length - 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Enhanced Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center ">
                <div className="flex items-center   w-full">
                  <h2 className="text-lg font-semibold text-gray-900 mr-14">Live Preview</h2>
                  <div className="flex items-center justify-center gap-4">
                    <TemplateSelector 
                      selectedTemplate={resumeData.template} 
                      onChange={(template) => setResumeData({...resumeData, template})} 
                    />
                    <ColorPicker 
                      selectedColor={resumeData.accent_color} 
                      onChange={(color) => setResumeData({...resumeData, accent_color: color})} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-auto flex-1 bg-gray-50" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="p-4">
                <div 
                  className={`mx-auto transition-all duration-300 ${removeBackground ? 'shadow-none' : 'shadow-lg'}`}
                  style={{ 
                    width: '210mm',
                    minHeight: '297mm',
                    maxWidth: '100%',
                    transform: 'scale(0.65)',
                    transformOrigin: 'top center',
                    marginBottom: '-35%'
                  }}
                >
                  <ResumePreview 
                    data={resumeData} 
                    template={resumeData.template} 
                    accentColor={resumeData.accent_color}
                    sections={sections.filter(s => s.id !== 'personal' && isSectionComplete(s.id))}
                    classes="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ResumeBuilder;
