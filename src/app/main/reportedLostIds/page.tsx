import { getAllPayments } from '@/actions/payments';
import { getAllReportedLostId } from '@/actions/ReportedLostIds';
import ReportedLostIds from '@/components/ReportedLostIds/ReportedLostIds';
import React from 'react'

const page = async() => {
  const initialStudents = await getAllReportedLostId() || [];
    const payments = await getAllPayments() || [];

  return (
    <div>
      <ReportedLostIds initialStudents={initialStudents} payments={payments}/>
    </div>
  )
}

export default page