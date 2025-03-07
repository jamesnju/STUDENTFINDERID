import { getReportedFoundId } from '@/actions/ReportedFoundIds';
import ReportedFoudIds from '@/components/reportedLostId/ReportedFoudIds';
import React from 'react'

const page = async() => {
  const initialStudents = await getReportedFoundId() ?? [];

  return (
    <div>
      <ReportedFoudIds initialStudents={initialStudents}/>
    </div>
  )
}

export default page