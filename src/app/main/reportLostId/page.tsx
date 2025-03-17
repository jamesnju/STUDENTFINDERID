import { getAllLostId, getByLostId } from '@/actions/ReportLostId';
import { options } from '@/app/api/auth/[...nextauth]/options';
import ReportLostId from '@/components/reportLostId/ReportLostId'
import { getServerSession } from 'next-auth';
import React from 'react'

const page = async() => {
  const session = await getServerSession(options);
  const lostids = await getAllLostId() || [];
  const userId = session?.user?.id; // Get logged-in user's ID
  const userRole = session?.user?.role; // Get user role 
  const initialStudents = userRole === "ADMIN" ? lostids : lostids.filter((lost: any) => lost.userId === userId);
    //console.log(initialStudents, "the server initial")
  return (
    <div>
        <ReportLostId initialStudents={initialStudents} />
    </div>
  )
}

export default page