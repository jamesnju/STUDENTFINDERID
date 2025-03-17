import { getReportedFoundId } from "@/actions/ReportedFoundIds";
import { getAllReportedLostId } from "@/actions/ReportedLostIds";
import { getAllUsers } from "@/actions/User";
import { options } from "@/app/api/auth/[...nextauth]/options";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const foundIDsData = (await getReportedFoundId()) ?? [];
  const lostIDsData = (await getAllReportedLostId()) ?? [];
  const getStudents = await getAllUsers() ?? [];
  const session = await getServerSession(options);
  //const foundIDsData = await getReportedFoundId() || [];
  const found = foundIDsData.length;
  const lost = lostIDsData.length;
  const users = getStudents.length;

  return (
    <div className="">
      {session?.user.role === "STUDENT" ? (
        <div className="space-y-6 ">
          <div className="space-y-2 ">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to the Student ID Finder dashboard.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Total Students</h3>
                <p className="text-2xl font-bold">{users}</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground shadow-sm">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Total Reported LostIds</h3>
                <p className="text-2xl font-bold">{lost || 0}</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Total Reported FoundIds</h3>
                <p className="text-2xl font-bold">{found || 0}</p>
              </div>
            </div>
          </div>
        </div>
      ) : session?.user.role === "ADMIN" ? (

        <AdminDashboard foundIDsData={foundIDsData} lostIDsData={lostIDsData} getStudents={getStudents}/>
      ): (
        <p className="w-full text-3xl text-red-600">You have No dashboard</p>
      )}
    </div>
  );
};

export default page;
