"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { DatePickerField } from '@/components/DatePickerField';
import { Dropdown } from '@/components/Dropdown';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { MultiSelectDropdown, GroupedSkills } from '@/components/MultiSelectDropdown';
import { PrintView } from '@/components/PrintView'
// for pdf
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';


// Array with sentences for the dropdown list
const sentences = [
  'Please, let me know, if you need any additional information.',
  'We recommend the intern as a promising young specialist in the field of IT law.',
  'The internship was successfully completed with excellent results',
  'The intern handled all assigned tasks with confidence and demonstrated a high level of preparation.',
  'Showed confident use of legal tools necessary in the field of information technology.',
  'We are confident in the intern’s professional potential and wish them continued success.'
]

// Interface for the intern object
interface Intern {
  full_name: string;
  position_name: string;
}

const RecommendationPage: React.FC = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const [skillsOptions, setSkillsOptions] = useState<GroupedSkills[]>([])
  const [tasksOptions, setTasksOptions] = useState<GroupedSkills[]>([])
  const [evalOptions, setEvalOptions] = useState<GroupedSkills[]>([])

  const [selectedInterns, setSelectedInterns] = useState<Intern | null>(null);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [selectedEvals, setSelectedEvals] = useState<string[]>([])
  const [selectedSenteces, SetSelectedSentences] = useState('');

  const [formState, setFormState] = useState({
    interns: '',
    internName: '',
    internPosition: '',
    startDay: '',
    endDay: '',
    skills: '',
    projects: '',
    evaluation: '',
    notes: '',
    recommenderName: 'Serge Garden',
    recommenderPosition: 'CEO',
    recommenderEmail: 'team@avbinvest.com',
    sentences: '',
    signature: '',
  });

  // Access token for API
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  
  //generation a letter in PDF format
  const letterRef = useRef<HTMLDivElement>(null)

  // generation dates in yyyy-MM-dd
  const fmt = (d: Date | null): string =>
    d ? d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      : '';

  // Handle form submission and PDF generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterRef.current) return;

    const dataUrl = await toPng(letterRef.current)

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const img = new window.Image()
    img.src = dataUrl

    await new Promise((r) => (img.onload = r))
    const pdfHeight = (img.height * pdfWidth) / img.width
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)

    const rawName = selectedInterns?.full_name || 'intern'

    //username in the email title
    const safeName = rawName
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
    const fileName = `recommendation_letter_${safeName}.pdf`

    pdf.save(fileName)


    // generate the payload for the backend
    const payload = {
      intern_full_name: selectedInterns?.full_name || '',
      division_name: selectedDivision,
      start_day: fmt(startDate),
      end_day: fmt(endDate),
      skills: selectedSkills,                         // Skills/Achievements/Etc.
      projects_tasks: selectedTasks.join('; '),       // Projects Completed/Tasks
      personal_evaluation: selectedEvals.join('; '),  // Personal Evaluation 
      about_cobuilder: formState.notes,               // Free writing About Intern
      recommendation_position: selectedPosition,      // убрать если письмо не будет отправляться на сервер
      responsible_full_name: formState.recommenderName,
      responsible_position: formState.recommenderPosition,
      responsible_email: formState.recommenderEmail,
      dataOfIssue: formattedDate,
    }

    try {
      // sending to backend
      const pdfBlob = pdf.output('blob');
      const formData = new FormData();
      formData.append('file', pdfBlob, 'recommendation.pdf');
      formData.append('data', JSON.stringify(payload))

      const res = await fetch(
        'http://49.12.128.167:8052/api/v1/letters/recommendations/',
        {
          method: 'POST',
          headers: {
            // 'Content-Type':  'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!res.ok) {
        const err = await res.json()
        console.error('Error creating letter:', err)
        alert('Failed to send recommendation letter')
        return
      }

      const data = await res.json()
      alert('Recommendation letter успешно создано!')

      // form reset
      setSelectedInterns(null)
      setSelectedDivision('')
      setStartDate(null)
      setSelectedPosition('')
      setSelectedSkills([])
      setSelectedTasks([])
      setSelectedEvals([])
    } catch (e) {
      console.error(e)
      alert('Network error when sending a letter')
    }
  }

  // Fetch interns from the API based on the search query
  const fetchInterns = async (query: string) => {
    const url = `http://49.12.128.167:8052/api/v1/users/external_users/?full_name=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setInterns(data.results);
  };

  // Handle intern selection from the dropdown
  const onInternSelect = (intern: Intern | null) => {
    setSelectedInterns(intern);
    setFormState(prev => ({
      ...prev,
      internName: intern?.full_name || '',
      internPosition: intern?.position_name || '',
    }));
  };

  useEffect(() => {

    // Download divisions
    fetch('http://49.12.128.167:8052/api/v1/organizations/divisions', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const names = data.results.map((item: any) => item.name);
        setDivisions(names || [])
      });

    //Download positions
    fetch('http://49.12.128.167:8052/api/v1/users/positions', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const positions = data.results.map((item: any) => item.name);
        setPositions(positions || [])
      });
  }, []);

  // Fetch skills, tasks, and evaluations when the selected division and intern position changes
  useEffect(() => {
    if (!selectedDivision || !formState.internPosition) return
    const params = new URLSearchParams({
      division_name: selectedDivision,    
    })

    const BACKEND = 'http://49.12.128.167:8052';
    const headers = { Authorization: `Bearer ${token}` }

    const SKILLS_URL = `${BACKEND}/api/v1/letters/skills/?${params}`
    const TASKS_URL = `${BACKEND}/api/v1/letters/project-tasks/?${params}`
    const EVAL_URL = `${BACKEND}/api/v1/letters/evaluations/?${params}`

    // Fetch skills, tasks, and evaluations from the API
    Promise.all([
      fetch(SKILLS_URL, { headers }).then(r => r.json()),
      fetch(TASKS_URL, { headers }).then(r => r.json()),
      fetch(EVAL_URL, { headers }).then(r => r.json()),
    ]).then(([skillsData, tasksData, evalData]) => {
      // Grouping skills, tasks, and evaluations by title 
      const groupByTitle = (arr: any[]): GroupedSkills[] => {
        const grouped: Record<string, string[]> = {};
        // Iterate over each item in the array
        arr.forEach(item => {
          const label = item.name ?? item.text ?? "";
          if (!grouped[item.title]) grouped[item.title] = [];
          grouped[item.title].push(label);
        });

        return Object.entries(grouped).map(
          ([title, skills]) => ({ title, skills })
        );
      };

      // Format the skills, tasks, and evaluations
      const formattedSkills = groupByTitle(skillsData.results);
      const formattedTasks = groupByTitle(tasksData.results);
      const formattedEval = groupByTitle(evalData.results);

      setSkillsOptions(formattedSkills);
      setTasksOptions(formattedTasks);
      setEvalOptions(formattedEval);
    }).catch(console.error)

  }, [selectedDivision, formState.internPosition]);

  // Get today's date in the format "Month Day, Year"
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center gap-y-6">
      <div className="relative">
        {/* PrintView — The element is hidden for a user, only for shooting in PDF */}
        <div className="absolute top-0 left-[-9999px] opacity-0 pointer-events-none">
          <PrintView
            ref={letterRef}
            internFullName={formState.internName}
            divisionName={selectedDivision}
            positionName={formState.internPosition}
            startDay={fmt(startDate)}
            endDay={fmt(endDate)}
            skills={selectedSkills}
            projectsTasks={selectedTasks.join(' ')}
            personalEvaluation={selectedEvals.join(' ')}
            aboutCobuilder={formState.notes}
            recommendationPosition={selectedPosition}
            sentence={selectedSenteces}
            responsibleFullName={formState.recommenderName}
            responsiblePosition={formState.recommenderPosition}
            responsibleEmail={formState.recommenderEmail}
            dateOfIssue={formattedDate}
          />
        </div>
      </div>
      <main className=" bg-white pl-[200px] pr-[200px] shadow-lg rounded-lg pt-[100px]">
        <header
          className="mt-[30px] flex justify-between items-center"
        >
          <div className='flex flex-col'>
            <Image
              src="/images/avb.png"
              alt="AVB Logo"
              width={272}
              height={116}
              className="object-contain"
            />
            <p className="p-small">AUTO VENTURE BUILDER</p>
          </div>
          <div
            className="
            text-right 
            font-normal 
            text-[10px] 
            leading-tight
          "
          >
            <p className='p-small'><strong>Auto Venture Builder Invest Inc</strong></p>
            <p className='p-small'>373 Lexington Avenue,</p>
            <p className='p-small'>369 New Your, NY, 10017</p>
            <p className='p-small'><strong>AVB Invest Inc</strong></p>
            <p className='p-small'>@onboarding_team@avbinvest.co</p>
          </div>
        </header>

        <div className="pt-[90px] flex justify-center">
          <h1 className="text-[54px] font-medium mb-[80px]">Letter of Recommendation</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex items-center mb-[50px]">
              <p>This letter confirms that</p>

              <SearchableDropdown
                placeholder="Intern's Full Name"
                options={interns}
                value={selectedInterns}
                onChange={onInternSelect}
                onSearch={fetchInterns}
                className="w-[354px] mr-[20px] ml-[20px] bl-[20px]"
              />
              <p>has finished</p>
            </div>

            <div className=' flex items-center mb-[10px]'>
              <Dropdown
                placeholder='Division'
                options={divisions}
                value={selectedDivision}
                onChange={setSelectedDivision}
                className="w-[439px]"
              />

              <p className='pr-[8px] pl-[8px]'>an intership as a </p>

              <Dropdown
                placeholder='Position'
                options={positions}
                value={formState.internPosition}
                onChange={val =>
                  setFormState(prev => ({ ...prev, internPosition: val }))
                }
                className="w-[434px]"
              />
            </div>

            <div className="flex items-center mb-[20px]">
              <p className='pr-[12px]'>at AVB from</p>

              <DatePickerField
                placeholderText="Start Day"
                selected={startDate}
                onChange={setStartDate}
              />

              <p className="pr-[12px]">to</p>

              <DatePickerField
                placeholderText="End Day"
                selected={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>

          <div>
            <p>And demonstrated the following skills and competences:</p>

            <MultiSelectDropdown
              options={skillsOptions}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Skills/Achievements/Etc."
              className="w-[567px] mb-[50px] mt-[18px]"
            />

            <div className="flex items-center gap-x-2 mb-[10px]">
              <input
                type="text"
                readOnly
                className="border-b text-[28px] text-[#192836] pl-[8px] w-[312px]"
                value={formState.internName}
                placeholder="Intern’s Full Name"
              />

              <p>
                during the Internship worked on the following Projects:
              </p>
            </div>

            <MultiSelectDropdown
              options={tasksOptions}
              selected={selectedTasks}
              onChange={setSelectedTasks}
              placeholder="Projects Completed/Tasks"
              className="mb-[20px]"
            />

            <MultiSelectDropdown
              options={evalOptions}
              selected={selectedEvals}
              onChange={setSelectedEvals}
              placeholder="Personal Evaluation of the Results of the Intern"
              className="mb-[20px]"
            />
          </div>

          <textarea
            placeholder="Free writing About Intern "
            value={formState.notes}
            onChange={e =>
              setFormState(prev => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            className="
              w-full border-[1px] border-black
              text-[28px] text-[#192836] placeholder-[#192836]/40
              overflow-y-auto
              focus:outline-none resize-none
              h-[110px]
              pl-[20px]
              pt-[24px]
              mb-[50px]
            "
          ></textarea>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p>
                It is my great pleasure to recommend this Intern for employment as a
              </p>
              <Dropdown
                placeholder="Position/Specialization/Area"
                options={positions}
                value={selectedPosition}
                onChange={setSelectedPosition}
                className="w-[610px]"
              />
            </div>

            <Dropdown
              placeholder='Please, let me know, if you need any additional in formation.'
              options={sentences}
              value={selectedSenteces}
              onChange={SetSelectedSentences}
              className="w-full"
            />
          </div>

          {/* Sincerely-block  */}
          <div className="flex justify-between items-end mb-[42px]">
            {/** Left side **/}
            <div className="">
              <p className="text-[10px]">Sincerely,</p>

              {/* Full Name */}
              <input
                type="text"
                placeholder='Serge Garden'
                value={formState.recommenderName}
                readOnly
                className="
                  w-[200px]
                  border-b border-black
                  text-[10px] placeholder-[#192836] 
                  focus:outline-none py-1
                  pl-[8px]
                "
              />

              <input
                type="text"
                placeholder='CEO'
                value={formState.recommenderPosition}
                readOnly
                className="
                  w-[200px]
                  border-b border-black
                  text-[10px] placeholder-[#192836] 
                  focus:outline-none py-1
                  pl-[8px]
                "
              />

              <input
                type="email"
                placeholder='team@avbinvest.com'
                value={formState.recommenderEmail}
                readOnly
                className="
                  w-[200px]
                  border-b border-black
                  text-[10px] placeholder-[#192836] 
                  focus:outline-none py-1
                  pl-[8px]
                "
              />
            </div>

            {/** Right side **/}
            <div className="space-y-4 flex flex-col items-end">
              {/* Signature  // переделать дропдаун на image подписи и печати */}
              <Dropdown
                placeholder="Signature"
                options={[]} 
                value={formState.signature || ''}
                onChange={val => setFormState(prev => ({ ...prev, signature: val }))}
                className="w-[200px]"
              />

              {/* Current date */}
              <p className="text-[10px] text-[#192836]">
                {formattedDate}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="cursor-pointer bg-[#4F93CF] text-white text-[20px] rounded-[88px] py-[10px] px-[66px]"
            >
              Submit
            </button>
          </div>
        </form>

      </main>

    </div>
  );
};

export default RecommendationPage;
