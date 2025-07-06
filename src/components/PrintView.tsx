import React, { forwardRef } from 'react'

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
      h-[297mm]        
      mx-auto
      p-[20mm]         
      font-sans
      text-[12pt]      
      leading-relaxed
      border            
      border-gray-300
      shadow-lg         
    `}
  >
    <header className="flex justify-between items-start mb-[10mm]">
      <div>
        <img src="/images/avb.png" alt="AVB Logo" width={272} height={116} />
        <p className="p-small">AUTO VENTURE BUILDER</p>
      </div>
      <div className="text-right">
        <p className='p-small'><strong>Auto Venture Builder Invest Inc</strong></p>
            <p className='p-small'>373 Lexington Avenue,</p>
            <p className='p-small'>369 New Your, NY, 10017</p>
            <p className='p-small'><strong>AVB Invest Inc</strong></p>
            <p className='p-small'>@onboarding_team@avbinvest.co</p>
      </div>
    </header>

    <h1 className="text-center text-[24pt] mb-[15mm]">
      Letter of Recommendation
    </h1>

    <p className="mb-[6mm]">
      This letter confirms that <strong>{internFullName}</strong> has finished an internship as a{' '}
      <strong>{positionName}</strong> in <strong>{divisionName}</strong>{' '}at AVB from{' '}
      <strong>{startDay}</strong> to <strong>{endDay}</strong>.
    </p>

    <p className="mb-[4mm]">
      And demonstrated the following skills and competences:
    </p>
    <ul className="p-small list-none list-inside mb-[8mm]">
      {skills.map(skill => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>

    <p className="mb-[6mm]">
      During the internship worked on the following projects:
      <br />
      {projectsTasks}
    </p>

    <p className="mb-[6mm]">
      {personalEvaluation}
    </p>

    <p className="mb-[8mm]">
      {aboutCobuilder}
    </p>

    <p className="mb-[8mm]">
      It is my great pleasure to recommend this Intern for employment as a{' '}
      <strong>{recommendationPosition}</strong>.
    </p>
    <p className="mb-[12mm]">
      {sentence}
    </p>

    <div className="mb-12">
      <p>Sincerely,</p>
      <p className="mt-4">
        <strong>{responsibleFullName}</strong><br />
        {responsiblePosition}<br />
        {responsibleEmail}
      </p>
    </div>

    <p className="text-right">{dateOfIssue}</p>
  </div>
))
PrintView.displayName = 'PrintView'
