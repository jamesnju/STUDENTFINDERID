import { getAllLostId } from '@/actions/ReportLostId';
import { getAllUsers } from '@/actions/User';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Users from '@/components/users/Users'
import { getServerSession } from 'next-auth';
import React from 'react'

const page = async() => {
    const initialStudents = await getAllUsers() || [];
     const session = await getServerSession(options);
  return (
    <div>
      {session?.user.role === "STUDENT" ? (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#FFEBEE", color: "#D32F2F" }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied  You Have Permission</h1>
          <a href="/main/dashboard" className="mt-6 inline-block bg-primary text-white py-2 px-4 rounded">
            Go to Home Page
          </a>
        </div>
      </div>

      ) : session?.user.role === "ADMIN" ? (

        <Users initialStudents={initialStudents}/>
      ) : (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#FFEBEE", color: "#D32F2F" }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied You have Permission</h1>
          <a href="/main/dashboard" className="mt-6 inline-block bg-primary text-white py-2 px-4 rounded">
            Go to Home Page
          </a>
        </div>
      </div>
      )}
    </div>
  )
}

export default page