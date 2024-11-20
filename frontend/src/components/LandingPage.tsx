'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Brain, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Link from 'next/link'
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { setTheme, theme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
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
        ease: 'easeInOut',
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  }

  const createFloatingAnimation = (delay: number) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: delay,
    },
  })

  const handleThemeChange = () => {
    try {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    } catch (err) {
      console.error('Error changing theme:', err)
      setError('Failed to change theme. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-waikawa-200 via-waikawa-400 to-waikawa-600 dark:from-waikawa-800 dark:via-waikawa-900 dark:to-waikawa-950">
      <div className="absolute inset-0 backdrop-blur-3xl">
        <div className="absolute -left-32 top-0 h-96 w-96 animate-blob rounded-full bg-waikawa-300/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-600/30"></div>
        <div className="absolute -right-32 top-0 h-96 w-96 animate-blob animation-delay-2000 rounded-full bg-waikawa-400/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-700/30"></div>
        <div className="absolute -bottom-32 left-32 h-96 w-96 animate-blob animation-delay-4000 rounded-full bg-waikawa-500/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-800/30"></div>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="backdrop-blur-md"
            onClick={handleThemeChange}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container relative mx-auto px-4 py-20"
        >
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <motion.div variants={containerVariants} className="text-center">
            <motion.h1 
              variants={itemVariants} 
              className="mb-6 text-5xl font-bold text-waikawa-950 dark:text-waikawa-50"
            >
              PDF Analyzer
            </motion.h1>
            <motion.p 
              variants={itemVariants} 
              className="mb-8 text-xl text-waikawa-800 dark:text-waikawa-200"
            >
              Upload your PDFs and get instant answers to your questions
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/analyze">
                <Button 
                  size="lg" 
                  className="bg-waikawa-600 text-white hover:bg-waikawa-700 dark:bg-waikawa-300 dark:text-waikawa-950 dark:hover:bg-waikawa-200"
                >
                  Start Analyzing
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="mt-20 flex justify-center">
            {[
              { Icon: FileText, delay: 0 },
              { Icon: Search, delay: 0.5 },
              { Icon: Brain, delay: 1 },
            ].map(({ Icon, delay }, index) => (
              <motion.div
                key={index}
                animate={createFloatingAnimation(delay)}
                variants={iconVariants}
                className="mx-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-lg dark:bg-white/5"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <Icon size={48} className="text-waikawa-800 dark:text-waikawa-200" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}