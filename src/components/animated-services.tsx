"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSearch, Shield, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"

const services = [
  {
    icon: <FileSearch className="h-10 w-10 text-primary" />,
    title: "Report Lost Id",
    description:
      "Quickly report your lost ID  with our easy-to-use form. Add photos and detailed descriptions to help with identification.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Prove Ownership",
    description:
      "Our secure verification system ensures that only the rightful owner can claim lost Id through a multi-step verification process.",
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: "Get It Back",
    description:
      "Once ownership is verified, we facilitate the safe return of your id through our secure handover process with tracking and confirmation.",
  },
  {
    icon: <FileSearch className="h-10 w-10 text-primary" />,
    title: "Digital ID Backup",
    description:
      "Create secure digital backups of your important IDs and documents for quick access in case of loss or theft.",
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Community Network",
    description: "Join our community of responsible citizens helping each other recover lost Id across the country.",
  },
]

export function AnimatedServices() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex gap-6 py-4"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...services, ...services].map((service, index) => (
          <Card key={index} className="min-w-[300px] md:min-w-[350px] shadow-md border-none">
            <CardHeader>
              <div className="mb-4">{service.icon}</div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  )
}

