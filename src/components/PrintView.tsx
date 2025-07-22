import React, { forwardRef } from 'react';
import Image from 'next/image';

export interface PrintViewProps {
  internFullName: string
  divisionName: string
  positionName: string
  recommendationPosition: string
  startDay: string
  endDay: string
  skills: string[]
  projectsTasks: string
  personalEvaluation: string
  aboutCobuilder: string
  sentence: string
  responsibleFullName: string
  responsiblePosition: string
  responsibleEmail: string
  dateOfIssue: string
}

export const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(({
  internFullName,
  divisionName,
  positionName,
  recommendationPosition,
  startDay,
  endDay,
  skills,
  projectsTasks,
  personalEvaluation,
  aboutCobuilder,
  sentence,
  responsibleFullName,
  responsiblePosition,
  responsibleEmail,
  dateOfIssue,
}, ref) => (
  <div
    ref={ref}
    className={`
      bg-white
      w-[210mm]        
      min-h-[297mm]        
      mx-auto
      p-[20mm]         
      font-sans
      text-[12pt]      
      leading-relaxed
      border            
      border-gray-300
      shadow-lg   
      flex flex-col      
    `}
  >
    <header className="flex justify-between items-start mb-[8mm]">

      <div>
        <Image src="/images/avb.png" alt="AVB Logo" width={109} height={46} />
        <p className="p-print-small text-center">AUTO VENTURE BUILDER</p>
      </div>
      <div className="text-right">
        <p className='p-print-small font-medium'>Auto Venture Builder Invest Inc</p>
        <p className='p-print-small'>373 Lexington Avenue,</p>
        <p className='p-print-small mb-[5px]'>369 New Your, NY, 10017</p>
        <p className='p-print-small font-medium'>AVB Invest Inc</p>
        <p className='p-print-small'>@onboarding_team@avbinvest.co</p>
      </div>
    </header>
    <main className="flex-grow">
      <h1 className="text-center text-[24px] mb-[8mm]">
        Letter of Recommendation
      </h1>

      <p className="mb-[2mm] p-print">
        This letter confirms that {internFullName} has finished an internship as a{' '}
        {positionName} in {divisionName}{' '}at AVB from{' '}
        {startDay} to {endDay}
      </p>

      <p className="mb-[2mm] p-print">
        and demonstrated the following skills and competences:
      </p>
      <ul className="p-print list-none list-inside mb-[2mm]">
        {skills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <p className="mb-[2mm] p-print">
        During the internship worked on the following projects:
        <br />
        {projectsTasks}
      </p>

      <p className="mb-[2mm] p-print">
        {personalEvaluation}
      </p>

      <p className="mb-[2mm] p-print">
        {aboutCobuilder}
      </p>

      <p className="mb-[2mm] p-print ">
        It is my great pleasure to recommend this Intern for employment as a{' '}
        {recommendationPosition}.
      </p>
      <p className="mb-[10mm] p-print">
        {sentence}.
      </p>
    </main>
    <footer>
      <div className="grid grid-cols-[max-content_2fr_max-content] items-end mb-5 p-print">
        <div className="flex flex-col space-y-1">
          <p className='p-small'>Sincerely,</p>
          <p className="mt-4 p-print">
            {responsibleFullName}<br />
            {responsiblePosition}<br />
            {responsibleEmail}
          </p>

        </div>

        <div className="flex justify-center items-end gap-4">
          <Image src="/images/signature.png" alt="signature" width={120} height={77} priority className="object-contain" />
          <Image src="/images/stamp.png" alt="stamp" width={120} height={77} priority className="object-contain" />
        </div>

        <div className="flex flex-col items-end">
          <p className="p-print-small text-[#192836]">{dateOfIssue}</p>
        </div>
      </div>
    </footer>
  </div>
))
PrintView.displayName = 'PrintView'
