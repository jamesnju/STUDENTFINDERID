import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Search, Shield, UserRound } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "@/components/animated-counter"
import { AnimatedServices } from "@/components/animated-services"
import { HeroSection } from "@/components/hero-section"
import { TeamSection } from "@/components/team-section"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bgprimary bg-gradient-to-r from-blue-100 to-purple-100">
      <header className="sticky top-0 z-40 border-b bg-background/95 bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x- ">
            <Image src="/logo.jpeg" alt="LostFound Logo" width={60} height={40} />
            {/* <span className="text-2xl font-bold text-primary">LostFound</span> */}
          </Link>
          <nav className="hidden md:flex gap-6 bg-bgprimary">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary hover:underline">
              How It Works
            </Link>
            <Link href="#services" className="text-sm font-medium hover:text-primary hover:underline">
              Services
            </Link>
            <Link href="#impact" className="text-sm font-medium hover:text-primary hover:underline">
              Our Impact
            </Link>
            <Link href="#team" className="text-sm font-medium hover:text-primary hover:underline">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            {/* <Button size="sm" asChild>
              <Link href="/register">Register</Link>
            </Button> */}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section id="how-it-works" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-blue-800">How It Works</h2>
              <p className=" max-w-2xl mx-auto text-blue-600">
                Our platform makes it easy to report and recover lost ids through a simple process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-blue-700">Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-600">
                    Quickly report your lost ID with details and optional photos to help with identification.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-blue-700">Verify</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-600">
                    Our system matches lost and found reports, and verifies ownership through secure verification.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-blue-700">Recover</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-600">
                    Once verified, arrange safe return of your id through our secure handover process.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="services" className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-purple-800">Our Services</h2>
              <p className=" max-w-2xl mx-auto text-purple-600">
                We offer comprehensive solutions for lost and found School IDs
              </p>
            </div>

            <AnimatedServices />
          </div>
        </section>

        <section id="impact" className="py-20 bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Impact</h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Making a difference in people&apos;s lives through our lost and found platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-5xl font-bold mb-4 text-yellow-300">
                  <AnimatedCounter value={1500} />+
                </div>
                <h3 className="text-xl font-medium mb-2">Items Recovered</h3>
                <p className="text-primary-foreground/80">
                  Successfully reunited thousands of people with their lost belongings
                </p>
              </div>

              <div className="p-6">
                <div className="text-5xl font-bold mb-4 text-yellow-300">
                  <AnimatedCounter value={25000} />+
                </div>
                <h3 className="text-xl font-medium mb-2">Active Users</h3>
                <p className="text-primary-foreground/80">
                  Growing community of users helping each other recover lost items
                </p>
              </div>

              <div className="p-6">
                <div className="text-5xl font-bold mb-4 text-yellow-300">
                  <AnimatedCounter value={98} />%
                </div>
                <h3 className="text-xl font-medium mb-2">Success Rate</h3>
                <p className="text-primary-foreground/80">High success rate for items reported within 48 hours</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-green-800">What Our Users Say</h2>
              <p className=" max-w-2xl mx-auto text-green-600">
                Real stories from people who have used our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-md hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-green-800" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-green-900">Sarah Johnson</CardTitle>
                      <CardDescription>Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                  &apos;I lost my student ID during finals week and was panicking. Within 24 hours of reporting it on
                    FindMyID, someone had found it and I got it back. Lifesaver&apos;
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-green-800" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-green-900">Lakisha Kipchumba</CardTitle>
                      <CardDescription>Student at pwani</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                  &apos;Lost my wallet with all my cards and ID. The verification system made sure it was returned safely
                    to me without any issues. Highly recommend&apos;
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center">
                      <UserRound className="h-5 w-5 text-green-800" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-green-900">Joy Muthoni</CardTitle>
                      <CardDescription>Lecturer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                  &apos;Found someone&apos;s school ID and used FindMyID to report it. The process was so simple, and I
                    felt good knowing I helped someone get their ID back safely.&apos;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <TeamSection />
      </main>

      <footer className="border-t text-white font-bold bg-gradient-to-r from-[#2C3E50] to-[#34495E]">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Image src="/logo.jpeg" alt="LostFound Logo" width={60} height={60} />
                <span>FindMyID</span>
              </div>
              <p className=" text-white text-sm">
                Helping people recover lost IDs through our secure platform.
              </p>
            </div>

            <div className="text-white">
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    Report Lost ID
                  </Link>
                </li>
                {/* <li>
                  <Link href="#" className=" hover:text-foreground">
                    Report Found Item
                  </Link>
                </li> */}
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    View Reported IDs
                  </Link>
                </li>
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className=" hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="">Email: contact@findmyid.com</li>
                <li className="">Phone: +2 (475) 123-4567</li>
                <li className="flex gap-4 mt-4">
                  <Link href="#" className=" hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </Link>
                  <Link href="#" className=" hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-facebook"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </Link>
                  <Link href="#" className=" hover:text-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm ">
            <p>© {new Date().getFullYear()} FindMyID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}