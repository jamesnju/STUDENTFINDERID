import { getAllPayments } from '@/actions/payments';
import { getReportedFoundId } from '@/actions/ReportedFoundIds';
import ReportedFoudIds from '@/components/reportedLostId/ReportedFoudIds';
import React from 'react'

const page = async() => {
  const initialStudents = await getReportedFoundId() ?? [];
  const payments = await getAllPayments() || [];

  return (
    <div className='bg-white'>
      <ReportedFoudIds initialStudents={initialStudents} payments={payments} />
    </div>
  )
}

export default page