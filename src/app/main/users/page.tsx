import { getAllLostId } from '@/actions/ReportLostId';
import { getAllUsers } from '@/actions/User';
import Users from '@/components/users/Users'
import React from 'react'

const page = async() => {
      const initialStudents = await getAllUsers() || [];
    
  return (
    <div>
        <Users initialStudents={initialStudents}/>
    </div>
  )
}

export default page