// import { useState } from 'react'
import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
interface FormData {
  name: string
  job_role: string
  linkedin: string
  github: string
  experience: string
  skills: string[]
}
const App = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    job_role: '',
    linkedin: '',
    github: '',
    experience: '',
    skills: []
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const skills = checked 
        ? [...formData.skills, value]
        : formData.skills.filter(skill => skill !== value)
      setFormData({ ...formData, skills })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get existing data from localStorage or initialize empty array
    const existingData = JSON.parse(localStorage.getItem('formData') || '[]')
    
    // Add new form data to the array
    const newData = [...existingData, formData]
    
    setLoading(true)
    console.log('New submission:', formData)
    
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
        localStorage.setItem('formData', JSON.stringify(newData))
      }, 4000)
    })

    setFormData({
      name: '',
      job_role: '',
      linkedin: '',
      github: '',
      experience: '',
      skills: []
    })
    alert('Form submitted successfully')
    setLoading(false)
  }
  return (
    <>
     <div className="text-white">
       <div className="max-w-3xl mx-auto mt-32 h-[60vh]">
       <h1 className="text-center text-2xl font-bold py-4">Form Candidate</h1>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4 border border-white rounded-xl p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">Name*</label>
            <input type="text" name='name' placeholder='Enter your name' className="border border-green-600 p-2 rounded-tr-xl rounded-bl-xl outline-none" onChange={handleChange} value={formData.name} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="" >Job Role*</label>
            <input type="text" name='job_role' placeholder='Enter your job role' className="border border-green-600 p-2 rounded-tr-xl rounded-bl-xl outline-none" onChange={handleChange} value={formData.job_role} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">LinkedIn Url*</label>
            <input type="url" name='linkedin' placeholder='Enter your linkedin url' className="border border-green-600 p-2 rounded-tr-xl rounded-bl-xl outline-none" onChange={handleChange} value={formData.linkedin} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">Github Url*</label>
            <input type="url" name='github' placeholder='Enter your github url' className="border border-green-600 p-2 rounded-tr-xl rounded-bl-xl outline-none" onChange={handleChange} value={formData.github} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="">Experience Level*</label>
            <select name="experience" id="experience" className="border border-green-600 p-2 rounded-tr-xl rounded-bl-xl outline-none" onChange={handleChange} value={formData.experience}>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {["React", "Nodejs", "Docker"].map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="checkbox"
                  id={`skill-${item}`}
                  name="skills"
                  value={item}
                  checked={formData.skills.includes(item)}
                  onChange={handleChange}
                  className="hidden"
                />
                <label 
                  htmlFor={`skill-${item}`} 
                  className={`p-2 rounded-tr-xl rounded-bl-xl cursor-pointer ${
                    formData.skills.includes(item) ? 'bg-green-500 text-white' : 'bg-white text-black'
                  }`}
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button type='submit' className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer'> {loading ? 'Loading...' : 'Submit'}</button>
          </div>
        </form>
        <Link to="/view-candidate">
        <button className='bg-white text-black p-2 rounded-tr-xl rounded-bl-xl hover:bg-gray-200 px-4 cursor-pointer mt-32 mx-auto'>
        View Candidate
    </button>
    </Link>
       </div>
     </div>
    </>
  )
}

export default App
