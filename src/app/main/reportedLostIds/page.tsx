import { getAllReportedLostId } from '@/actions/ReportedLostIds';
import ReportedLostIds from '@/components/ReportedLostIds/ReportedLostIds';
import React from 'react'

const page = async() => {
  const initialStudents = await getAllReportedLostId() || [];

  return (
    <div>
      <ReportedLostIds initialStudents={initialStudents}/>
    </div>
  )
}

export default page