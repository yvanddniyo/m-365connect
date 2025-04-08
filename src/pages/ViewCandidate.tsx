import { useState, useEffect } from 'react'
interface Candidate {
    name: string
    job_role: string
    experience: string
    skills: string[]
    linkedin: string
    github: string
}
const ViewCandidate = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[] | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [openRole, setOpenRole] = useState(false)
    const [openExperience, setOpenExperience] = useState(false)
    const [openStack, setOpenStack] = useState(false)
    const [activeRoleFilter, setActiveRoleFilter] = useState('')
    const [activeExperienceFilter, setActiveExperienceFilter] = useState('')
    const [activeStackFilter, setActiveStackFilter] = useState('')
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)


    useEffect(() => {
        const formData = JSON.parse(localStorage.getItem('formData') || '[]')
        setCandidates(formData)
        setFilteredCandidates(formData)
    }, [])

    useEffect(() => {
        let result = [...candidates]
        
        if (activeRoleFilter) {
            result = result.filter(candidate => 
                candidate.job_role?.toLowerCase() === activeRoleFilter.toLowerCase()
            )
        }
        
        if (activeExperienceFilter) {
            result = result.filter(candidate => 
                candidate.experience?.toLowerCase() === activeExperienceFilter.toLowerCase()
            )
        }
        if (activeStackFilter) {
            result = result.filter(candidate => 
                candidate.skills?.some(skill => 
                    skill.toLowerCase() === activeStackFilter.toLowerCase()
                )
            )
        }
        
        if (searchQuery) {
            result = result.filter(candidate => 
                candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                candidate.job_role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                candidate.experience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                candidate.skills?.some(skill => 
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        }
        
        setFilteredCandidates(result)
    }, [candidates, activeRoleFilter, activeExperienceFilter, activeStackFilter, searchQuery])

    const handleRoleFilter = (role: string) => {
        setActiveRoleFilter(activeRoleFilter === role ? '' : role)
        setOpenRole(false)
    }

    const handleExperienceFilter = (exp: string) => {
        setActiveExperienceFilter(activeExperienceFilter === exp ? '' : exp)
        setOpenExperience(false)
    }

    const handleStackFilter = (stack: string) => {
        setActiveStackFilter(activeStackFilter === stack ? '' : stack)
        setOpenStack(false)
    }


    const clearFilters = () => {
        setActiveRoleFilter('')
        setActiveExperienceFilter('')
        setActiveStackFilter('')
        setSearchQuery('')
    }

    const handleDelete = (index: number) => {
        if (!filteredCandidates) return;
        
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            const candidateToDelete = filteredCandidates[index];
            
            const originalIndex = candidates.findIndex(c => 
                c.name === candidateToDelete.name && 
                c.job_role === candidateToDelete.job_role &&
                c.github === candidateToDelete.github
            );
            
            if (originalIndex !== -1) {
                const updatedCandidates = [...candidates];
                updatedCandidates.splice(originalIndex, 1);
                
                setCandidates(updatedCandidates);
                localStorage.setItem('formData', JSON.stringify(updatedCandidates));
            }
        }
    }

    const handleEdit = (index: number) => {
        if (!filteredCandidates) return;
        
        setEditingCandidate({...filteredCandidates[index]});
        setEditingIndex(index);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = () => {
        if (!editingCandidate || !filteredCandidates || editingIndex === null) return;
        
        const originalIndex = candidates.findIndex(c => 
            c.name === filteredCandidates[editingIndex].name && 
            c.job_role === filteredCandidates[editingIndex].job_role &&
            c.github === filteredCandidates[editingIndex].github
        );
        
        if (originalIndex !== -1) {
            const updatedCandidates = [...candidates];
            
            const { ...candidateToSave } = editingCandidate;
            
            updatedCandidates[originalIndex] = candidateToSave;
            
            setCandidates(updatedCandidates);
            localStorage.setItem('formData', JSON.stringify(updatedCandidates));
            
            setIsEditModalOpen(false);
            setEditingCandidate(null);
        }
    }

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingCandidate) return;
        
        const { name, value } = e.target;
        setEditingCandidate({
            ...editingCandidate,
            [name]: value
        });
    }

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingCandidate) return;
        
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setEditingCandidate({
            ...editingCandidate,
            skills: skillsArray
        });
    }

  return (
    <div className='w-full justify-center items-center flex text-white mt-32'>
      <div className="flex flex-col gap-4">
        <h1 className='text-2xl font-bold text-center'>View Candidate</h1>
        <div className="text-white my-3 flex items-center justify-center gap-4">
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search candidates...' 
                className='p-2 rounded-tr-xl rounded-bl-xl border border-white text-white w-1/3 outline-none' 
            />
            <div className="flex flex-col gap-2 relative">
                <button 
                    onClick={() => setOpenRole(!openRole)} 
                    className={`p-2 rounded-tr-xl rounded-bl-xl whitespace-nowrap hover:bg-gray-200 px-4 cursor-pointer ${activeRoleFilter ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                    {activeRoleFilter || 'Filter by Role'}
                </button>
                {openRole && (
                    <div className="absolute flex flex-col gap-2 z-50 top-12 left-0 w-full bg-white shadow-lg rounded-md">
                        <button onClick={() => handleRoleFilter('Full stack')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>Full stack</button>
                        <button onClick={() => handleRoleFilter('Frontend')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>Frontend</button>
                        <button onClick={() => handleRoleFilter('Backend')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>Backend</button>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 relative">
                <button 
                    onClick={() => setOpenExperience(!openExperience)} 
                    className={`p-2 rounded-tr-xl rounded-bl-xl whitespace-nowrap hover:bg-gray-200 px-4 cursor-pointer ${activeExperienceFilter ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                    {activeExperienceFilter || 'Filter by Experience'}
                </button>
                {openExperience && (
                    <div className="absolute flex flex-col gap-2 z-50 top-12 left-0 w-full bg-white shadow-lg rounded-md max-w-[100px]">
                        <button onClick={() => handleExperienceFilter('junior')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>junior</button>
                        <button onClick={() => handleExperienceFilter('mid')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>mid</button>
                        <button onClick={() => handleExperienceFilter('senior')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>senior</button>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 relative">
                <button 
                    onClick={() => setOpenStack(!openStack)} 
                    className={`p-2 rounded-tr-xl rounded-bl-xl whitespace-nowrap hover:bg-gray-200 px-4 cursor-pointer ${activeStackFilter ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                    {activeStackFilter || 'Filter by Stack'}
                </button>
                {openStack && (
                    <div className="absolute flex flex-col gap-2 z-50 top-12 left-0 w-full bg-white shadow-lg rounded-md">
                        <button onClick={() => handleStackFilter('React')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>React</button>
                        <button onClick={() => handleStackFilter('Nodejs')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>Nodejs</button>
                        <button onClick={() => handleStackFilter('Docker')} className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'>Docker</button>
                    </div>
                )}
            </div>
            {(activeRoleFilter || activeExperienceFilter || activeStackFilter || searchQuery) && (
                <button 
                    onClick={clearFilters}
                    className='bg-red-500 text-white p-2 rounded-tr-xl rounded-bl-xl hover:bg-red-600 px-4 cursor-pointer whitespace-nowrap'
                >
                    Clear Filters
                </button>
            )}
        </div>
        <div className="grid grid-cols-3 gap-4 ">
            { filteredCandidates && filteredCandidates?.length > 0 ? filteredCandidates?.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 border border-white p-4 rounded-tr-xl rounded-bl-xl relative">
                <h1>Name: {item.name}</h1>
                <h1>Job Role: {item.job_role}</h1>
                <h1>Linkedin: {item.linkedin}</h1>
                <h1>Github: {item.github}</h1>
                <h1>Experience: {item.experience}</h1>
                <h1>Skills: {item?.skills?.join(', ')}</h1>
                
                <div className="flex gap-2 mt-3">
                    <button 
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-tr-xl rounded-bl-xl hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-tr-xl rounded-bl-xl hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
            )) : <h1>No candidates match your filters</h1>}
        </div>
      </div>


      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-tr-xl rounded-bl-xl w-1/2 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Candidate</h2>
                
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={editingCandidate?.name || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Job Role</label>
                        <select 
                            name="job_role"
                            value={editingCandidate?.job_role || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        >
                            <option value="">Select Role</option>
                            <option value="Full stack">Full stack</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block mb-1">Experience</label>
                        <select 
                            name="experience"
                            value={editingCandidate?.experience || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        >
                            <option value="">Select Experience</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block mb-1">LinkedIn</label>
                        <input 
                            type="text" 
                            name="linkedin"
                            value={editingCandidate?.linkedin || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">GitHub</label>
                        <input 
                            type="text" 
                            name="github"
                            value={editingCandidate?.github || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Skills (comma-separated)</label>
                        <input 
                            type="text" 
                            value={editingCandidate?.skills?.join(', ') || ''}
                            onChange={handleSkillsChange}
                            className="w-full p-2 rounded-tr-xl rounded-bl-xl border border-white text-white bg-transparent"
                        />
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white px-4 py-2 rounded-tr-xl rounded-bl-xl hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button 
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setEditingCandidate(null);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default ViewCandidate