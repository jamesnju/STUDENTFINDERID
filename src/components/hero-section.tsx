"use client";
import { Button } from "@/components/ui/button";
import { FileSearch, Upload, List, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Lost Something Important?
            <span className="text-primary block mt-2">
              We&apos;ll Help You Find It
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Our platform connects people who have lost items with those who have
            found them, making the recovery process simple, secure, and
            stress-free.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button size="lg" className="gap-2" asChild>
              <Link href="/register">
                <FileSearch className="h-5 w-5" />
                Report Lost Id
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/registerFound">
                <Upload className="h-5 w-5" />
                Report Found Id
              </Link>
            </Button>
            {/* <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href="/view-reports">
                <List className="h-5 w-5" />
                View Reports
              </Link>
            </Button> */}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Image
            src="/lost.jpg"
            alt="FindMyID Platform Dashboard"
            className="w-full h-auto"
            height={600}
            width={1200}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-8">
            <Button
              variant="default"
              size="lg"
              className="gap-2 hover:bg-primary hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
    </div>
  );
}
