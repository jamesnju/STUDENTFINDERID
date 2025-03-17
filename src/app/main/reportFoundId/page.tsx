import { getAllFoundId } from '@/actions/ReportFoundId';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ReportFoundId from '@/components/reportFoudId/ReportFoundId'
import { getServerSession } from 'next-auth';
import React from 'react'

const page = async() => {
  const session = await getServerSession(options);
  const userId = session?.user?.id; // Get logged-in user's ID
  const userRole = session?.user?.role; // Get user role  
  const foundID = await getAllFoundId() || [];
  const initialStudents = userRole === "ADMIN" ? foundID : foundID.filter((found: any) => found.userId === userId);
  
//console.log(payments, "server ddddddddddd------------")
  return (
    <div>
      <ReportFoundId initialStudents={initialStudents}  />
    </div>
  )
}

export default page