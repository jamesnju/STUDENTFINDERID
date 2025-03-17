"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

const teamMembers = [
  {
    name: "Dr. Sarah Ndugu",
    role: "Founder & CEO",
    bio: "Former security expert with a passion for helping people recover lost items.",
    image: "/g1.jpg?height=300&width=300",
  },
  {
    name: "Michael Kiptum",
    role: "CTO",
    bio: "Tech innovator with expertise in secure verification systems and digital identity.",
    image: "/b1.jpg?height=300&width=300",
  },
  {
    name: "Kelvin Onyango",
    role: "Head of Operations",
    bio: "Operations specialist focused on creating efficient recovery processes.",
    image: "/b2.jpg?height=300&width=300",
  },
  {
    name: "James Kamu",
    role: "Head of Community",
    bio: "Building and nurturing our community of users across the country.",
    image: "/b3.jpg?height=300&width=300",
  },
]

export function TeamSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container" ref={ref}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate people behind our mission to help you find what you&apos;ve lost
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden border-none shadow-md">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    height={300}
                    width={300}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

