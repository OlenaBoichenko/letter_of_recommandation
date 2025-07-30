'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { DatePickerField } from '@/components/DatePickerField';
import { Dropdown } from '@/components/Dropdown';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import {
  MultiSelectDropdown,
  GroupedSkills,
} from '@/components/MultiSelectDropdown';
import { PrintView } from '@/components/PrintView';
import { Intern, DivisionsResponse, Position } from '@/interfaces/index';
// for pdf
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

// Generic API response wrapper
interface ApiResponse<T> {
  results: T[];
}

// Response type for positions
type PositionsResponse = ApiResponse<Position>;
// Raw item from skills/tasks/evaluations endpoints
interface OptionItem {
  title: string;
  name?: string;
  text?: string;
}


const RecommendationPage: React.FC = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [divisions, setDivisions] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [skillsOptions, setSkillsOptions] = useState<GroupedSkills[]>([]);
  const [tasksOptions, setTasksOptions] = useState<GroupedSkills[]>([]);
  const [evalOptions, setEvalOptions] = useState<GroupedSkills[]>([]);
  const [finalTextOptions, setFinalTextOptions] = useState<GroupedSkills[]>([]);

  const [selectedInterns, setSelectedInterns] = useState<Intern | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedEvals, setSelectedEvals] = useState<string[]>([]);
  const [selectedFinalText, setSelectedFinalText] = useState<string[]>([]);

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
    finalText: '',
    signature: '',
  });

  // Access token for API
  const token = process.env.NEXT_PUBLIC_API_TOKEN;

  //generation a letter in PDF format
  const letterRef = useRef<HTMLDivElement>(null);

  // generation dates in yyyy-MM-dd
  const fmt = (d: Date | null): string =>
    d
      ? d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      : '';

  // Handle form submission and PDF generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterRef.current) return;

    const dataUrl = await toPng(letterRef.current!, {
  pixelRatio: 3,          
  cacheBust: true,
  backgroundColor: '#fff',
});

    const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const img = new window.Image();
    img.src = dataUrl;

    await new Promise((r) => (img.onload = r));
    const pdfHeight = (img.height * pdfWidth) / img.width;
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const rawName = selectedInterns?.full_name || 'intern';

    //username in the email title
    const safeName = rawName
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    const fileName = `recommendation_letter_${safeName}.pdf`;

    pdf.save(fileName);

    // generate the payload for the backend
    // const payload = {
    //   intern_full_name: selectedInterns?.full_name || '',
    //   division_name: selectedDivision,
    //   start_day: fmt(startDate),
    //   end_day: fmt(endDate),
    //   skills: selectedSkills, // Skills/Achievements/Etc.
    //   projects_tasks: selectedTasks.join('; '), // Projects Completed/Tasks
    //   personal_evaluation: selectedEvals.join('; '), // Personal Evaluation
    //   about_cobuilder: formState.notes, // Free writing About Intern
    //   finlal_text: formState.finalText, // Final text
    //   recommendation_position: selectedPosition, 
    //   responsible_full_name: formState.recommenderName,
    //   responsible_position: formState.recommenderPosition,
    //   responsible_email: formState.recommenderEmail,
    //   dataOfIssue: formattedDate,
    // };

    // убрать если письмо не будет отправляться на сервер
    try {
      // sending to backend
      // const pdfBlob = pdf.output('blob');
      // const formData = new FormData();
      // formData.append('file', pdfBlob, 'recommendation.pdf');
      // formData.append('data', JSON.stringify(payload));

      // const res = await fetch(
      //   '/api/v1/letters/recommendations/',
      //   {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: formData,
      //   },
      // );

      // if (!res.ok) {
      //   const err = await res.json();
      //   console.error('Error creating letter:', err);
      //   alert('Failed to send recommendation letter');
      //   return;
      // }

      // const data = await res.json()
      alert('Recommendation letter was successfully created!');

      // form reset
      setSelectedInterns(null);
      setSelectedDivision('');
      setStartDate(null);
      setEndDate(null);
      setSelectedPosition('');
      setSelectedSkills([]);
      setSelectedTasks([]);
      setSelectedEvals([]);
      setSelectedFinalText([]);
      formState.internName = '';
      formState.internPosition = '';
      formState.notes = '';
    } catch (e) {
      console.error(e);
      alert('Network error when sending a letter');
    }
  };

  // Fetch interns from the API based on the search query
  const fetchInterns = async (query: string): Promise<void> => {
    const url = `http://49.12.128.167:8052/api/v1/users/external_users/?full_name=${encodeURIComponent(
      query,
    )}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await res.json()) as ApiResponse<Intern>;
    setInterns(data.results);
  };

  // Handle intern selection from the dropdown
  const onInternSelect = (intern: Intern | null) => {
    setSelectedInterns(intern);
    setFormState((prev) => ({
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
      .then((res) => res.json() as Promise<DivisionsResponse>)
      .then((data) => setDivisions(data.results.map((d) => d.name)));

    //Download positions
    fetch('http://49.12.128.167:8052/api/v1/users/positions', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json() as Promise<PositionsResponse>)
      .then((data) => setPositions(data.results.map((p) => p.name)));
  }, [token]);

  // Fetch skills, tasks, and evaluations when the selected division and intern position changes
  useEffect(() => {
    if (!selectedDivision || !formState.internPosition) return;
    const params = new URLSearchParams({
      division_name: selectedDivision,
    });

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch skills, tasks, evaluations and final_text from the API
    Promise.all([
      fetch(`http://49.12.128.167:8052/api/v1/letters/skills/?${params}`, {
        headers,
      }).then((r) => r.json() as Promise<ApiResponse<OptionItem>>),
      fetch(`http://49.12.128.167:8052/api/v1/letters/project-tasks/?${params}`, {
        headers,
      }).then((r) => r.json() as Promise<ApiResponse<OptionItem>>),
      fetch(`http://49.12.128.167:8052/api/v1/letters/evaluations/?${params}`, {
        headers,
      }).then((r) => r.json() as Promise<ApiResponse<OptionItem>>),
      fetch(`http://49.12.128.167:8052/api/v1/letters/final-texts/?${params}`, {
        headers,
      }).then((r) => r.json() as Promise<ApiResponse<OptionItem>>),
    ])
      .then(([skillsData, tasksData, evalData, finalData]) => {
        // Grouping skills, tasks, and evaluations by title
        const groupByTitle = (arr: OptionItem[]): GroupedSkills[] => {
          const grouped: Record<string, string[]> = {};
          // Iterate over each item in the array
          arr.forEach((item) => {
            const label = item.name ?? item.text ?? '';
            if (!grouped[item.title]) grouped[item.title] = [];
            grouped[item.title].push(label);
          });

          return Object.entries(grouped).map(([title, skills]) => ({
            title,
            skills,
          }));
        };

        // Format the skills, tasks, and evaluations
        setSkillsOptions(groupByTitle(skillsData.results));
        setTasksOptions(groupByTitle(tasksData.results));
        setEvalOptions(groupByTitle(evalData.results));
        setFinalTextOptions(groupByTitle(finalData.results));
      })
      .catch(console.error);
  }, [selectedDivision, formState.internPosition, token]);

  // Get today's date in the format "Month Day, Year"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
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
            final_text={selectedFinalText.join(' ')}
            responsibleFullName={formState.recommenderName}
            responsiblePosition={formState.recommenderPosition}
            responsibleEmail={formState.recommenderEmail}
            dateOfIssue={formattedDate}
          />
        </div>
      </div>
      <main className=" bg-white pl-[80px] pr-[80px] pt-[50px]">
        <header className="flex justify-between items-center">
          <div className="flex flex-col">
            <Image
              src="/images/avb.png"
              alt="AVB Logo"
              width={180}
              height={116}
              className="object-contain"
            />
            <p className="p-small text-center mt-[10px]">
              AUTO VENTURE BUILDER
            </p>
          </div>
          <div
            className="
            text-right 
            font-normal 
            text-[10px] 
            leading-tight
          "
          >
            <p className="p-small">
              <strong>Auto Venture Builder Invest Inc</strong>
            </p>
            <p className="p-small">373 Lexington Avenue,</p>
            <p className="p-small">369 New Your, NY, 10017</p>
            <p className="p-small mt-[10px]">
              <strong>AVB Invest Inc</strong>
            </p>
            <p className="p-small">@onboarding_team@avbinvest.co</p>
          </div>
        </header>

        <div className="pt-[80px] flex justify-center">
          <h1 className="text-[44px] font-medium mb-[50px]">
            Letter of Recommendation
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex items-center mb-[35px]">
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

            <div className=" flex items-center mb-[35px]">
              <Dropdown
                placeholder="Division"
                options={divisions}
                value={selectedDivision}
                onChange={setSelectedDivision}
              />

              <p className="pr-[10px] pl-[10px] ml-[12px] mr-[12px]">
                an intership as a{' '}
              </p>

              <Dropdown
                placeholder="Position"
                options={positions}
                value={formState.internPosition}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    internPosition: val,
                  }))
                }
              />
            </div>

            <div className="flex items-center mb-[35px]">
              <p className="pr-[12px]">at AVB from</p>

              <DatePickerField
                placeholderText="Start Day"
                selected={startDate}
                onChange={setStartDate}
              />

              <p className="mr-[12px] ml-[12px]">to</p>

              <DatePickerField
                placeholderText="End Day"
                selected={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>

          <div>
            <p>
              And demonstrated the following skills and
              competences:
            </p>

            <MultiSelectDropdown
              options={skillsOptions}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              placeholder="Skills/Achievements/Etc."
              className="mt-[18px]"
            />

            <div className="flex items-center gap-x-2 mb-[35px]">
              <input
                type="text"
                readOnly
                className="border-b 
                text-[22px] 
                text-[#192836] 
                pl-[8px] 
                w-[335px]"
                value={formState.internName}
                placeholder="Intern’s Full Name"
              />

              <p>during the Internship worked on the following Projects:</p>
            </div>

            <MultiSelectDropdown
              options={tasksOptions}
              selected={selectedTasks}
              onChange={setSelectedTasks}
              placeholder="Projects Completed/Tasks"
              className="w-full"
            />

            <MultiSelectDropdown
              options={evalOptions}
              selected={selectedEvals}
              onChange={setSelectedEvals}
              placeholder="Personal Evaluation of the Results of the Intern"
              className="w-full"
            />
          </div>

          <textarea
            placeholder="Free writing about Intern "
            value={formState.notes}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            className="
              w-full 
              border-[1px] 
              border-black
              text-[22px] 
               placeholder-[#192836]/40
              overflow-y-auto
              focus:outline-none resize-none
              h-[110px]
              pl-[20px]
              pt-[24px]
              mb-[35px]
            "
          ></textarea>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-[35px]">
              <p className="mr-[10px]">
                It is my great pleasure to recommend this Intern for employment as a
              </p>
              <Dropdown
                placeholder="Position/Specialization/Area"
                options={positions}
                value={selectedPosition}
                onChange={setSelectedPosition}
                className=""
              />
            </div>

            <MultiSelectDropdown
              options={finalTextOptions}
              selected={selectedFinalText}
              onChange={setSelectedFinalText}
              placeholder="Please, let me know, if you need any additional in formation."
              className="w-full"
            />
            {/* <Dropdown
              placeholder="Please, let me know, if you need any additional in formation."
              options={sentences}
              value={selectedSenteces}
              onChange={SetSelectedSentences}
              className="w-full"
            /> */}
          </div>

          {/* Sincerely-block  */}
          <div className="grid grid-cols-[max-content_2fr_max-content] items-end mb-[100px] mt-[100px]">
            {/** Left side **/}
            <div className="flex flex-col space-y-1">
              <p>Sincerely,</p>

              {/* Full Name */}
              <input
                type="text"
                placeholder="Serge Garden"
                value={formState.recommenderName}
                readOnly
                className="
                  w-[200px]
                  border-b 
                  border-black
                  py-1
                  pl-[8px]
                "
              />

              <input
                type="text"
                placeholder="CEO"
                value={formState.recommenderPosition}
                readOnly
                className="
                  w-[200px]
                  border-b border-black
                  py-1
                  pl-[8px]
                "
              />

              <input
                type="email"
                placeholder="team@avbinvest.com"
                value={formState.recommenderEmail}
                readOnly
                className="
                  w-[200px]
                  border-b border-black
                  py-1
                  pl-[8px]
                "
              />
            </div>
            {/* Current date */}
            <div className="flex flex-col items-end">
              <p className='p-small text-[#192836]'>
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="cursor-pointer bg-[#4F93CF] text-white text-[22px] rounded-[88px] py-[10px] px-[66px] mb-[20px]"
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
