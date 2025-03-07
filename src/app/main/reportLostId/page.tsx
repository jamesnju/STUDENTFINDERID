import { getAllLostId, getByLostId } from '@/actions/ReportLostId';
import ReportLostId from '@/components/reportLostId/ReportLostId'
import React from 'react'

const page = async() => {
  
  const initialStudents = await getAllLostId() || [];
    //console.log(initialStudents, "the server initial")
  return (
    <div>
        <ReportLostId initialStudents={initialStudents} />
    </div>
  )
}

export default page