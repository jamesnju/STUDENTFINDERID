import { getAllFoundId } from '@/actions/ReportFoundId';
import ReportFoundId from '@/components/reportFoudId/ReportFoundId'
import React from 'react'

const page = async() => {
  const initialStudents = await getAllFoundId() || [];
//console.log(payments, "server ddddddddddd------------")
  return (
    <div>
      <ReportFoundId initialStudents={initialStudents}  />
    </div>
  )
}

export default page