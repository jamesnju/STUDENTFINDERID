"use client"
import { useState } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react"
import { postUser } from "@/actions/User"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Define validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Name must be at least 3 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(/@gmail\.com$/, "Email must be valid")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
  reason: Yup.string().default("LOSTID")
})

interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  reason: string
}

export default function RegisterFormFound() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter();
  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, resetForm }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      console.log("Registration form submitted:", values);
      
      // Call the API
      const result = await postUser(values.name, values.email, values.password, values.reason);
      console.log("API Response:", result);
  
      // Check for success response
      if (result?.message === "success" && result?.data) {
        toast.success(`Registration successful! Welcome, ${result.data.name}`);
        router.push("/login");
        resetForm(); // Reset form after successful registration
        // You can redirect or perform additional actions here if needed
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="md:w-1/2 p-4 text-center md:text-left">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to StudentID Finder</h1>
        <h1 className="text-xl font-bold text-blue-600 mb-4">Register to Report <span className="text-green-500">FOUNDID</span> </h1>

        <p className="text-lg text-gray-700 mb-4">
          Find your student ID quickly and easily using our system. Register today and make the process seamless.
        </p>
        <p className="text-md text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-500">Login here</Link>
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
              initialValues={{ name: "", email: "", password: "", confirmPassword: "", reason: "FOUNDID" }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={errors.name && touched.name ? "border-destructive" : ""}
                    />
                    <ErrorMessage name="name" component="div" className="text-sm text-destructive" />
                  </div>

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
                        placeholder="Create a password"
                        className={errors.password && touched.password ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-sm text-destructive" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={errors.confirmPassword && touched.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-sm text-destructive" />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader className="text-white animate animate-spin "/> : "Register"}
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