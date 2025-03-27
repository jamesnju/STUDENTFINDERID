"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"

export interface SignInFormValues {
  email: string
  password: string
}

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/@gmail\.com$/, "Email must be valid")
    .required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
})

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (
    values: SignInFormValues,
    { setSubmitting, resetForm }: FormikHelpers<SignInFormValues>
  ) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
        router.push("/login")
      } else if (result?.ok && result?.status === 200) {
        toast.success("Sign-in successful!")
        router.push("/main/dashboard")
        resetForm()
      }
    } catch (error) {
      console.error("Sign-in error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="md:w-1/2 p-4 text-center md:text-left">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to StudentID Finder</h1>
        <p className="text-lg text-gray-700 mb-4">
          Find your student ID quickly and easily using our system. Login now and make the process seamless.
        </p>
        <p className="text-md text-gray-600">
          Don&apos;t have an account? <Link href="/registerFound" className="text-green-500 mb-2">Register here <span>FOUNDID</span></Link>
        </p>
        <p className="text-md text-gray-600">
          Don&apos;t have an account? <Link href="/register" className="text-blue-500">Register here for <span>LOSTID</span></Link>
        </p>
        <p className="text-md text-gray-600 px-4">
          <Link href="/" className="text-blue-500">Home</Link>
        </p>
      </div>
      <div className="md:w-1/2 p-4">
        <Card>
        <p className="text-md text-gray-600 px-4">
          <Link href="/" className="text-blue-500">Home</Link>
        </p>
          <CardContent className="pt-6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SignInSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@gmail.com"
                      className={errors.email && touched.email ? "border-destructive" : ""}
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={errors.password && touched.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader className="text-white animate animate-spin "/> : "Sign In"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}