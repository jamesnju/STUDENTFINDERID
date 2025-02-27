"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import Link from "next/link"

export default function PageView() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Student ID Finder</h1>
          <p className="text-muted-foreground">Login or register to find your student ID</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <Link href={"/"}>
            <TabsTrigger value="home">Back Home</TabsTrigger>
            </Link>

          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
          <TabsContent value="home" className="mt-6">
<p>Click to go back to home page</p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

