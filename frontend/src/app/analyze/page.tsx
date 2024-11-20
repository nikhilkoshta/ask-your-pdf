'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import Link from 'next/link'
import { useTheme } from "next-themes"
import { api, Document } from '@/lib/api'

export default function PDFAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setError(null)
      const docs = await api.getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError('Failed to fetch documents. Please try again.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload only PDF files')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    try {
      const doc = await api.uploadDocument(file)
      setDocuments([...documents, doc])
      setFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('Error uploading file:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!selectedDocument || !question) return

    setLoading(true)
    setError(null)
    try {
      const response = await api.askQuestion(selectedDocument, question)
      setAnswer(response.answer)
    } catch (error) {
      console.error('Error asking question:', error)
      setError(error instanceof Error ? error.message : 'Failed to get answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-waikawa-200 via-waikawa-400 to-waikawa-600 dark:from-waikawa-800 dark:via-waikawa-900 dark:to-waikawa-950">
      <div className="absolute inset-0 backdrop-blur-3xl">
        <div className="absolute -left-32 top-0 h-96 w-96 animate-blob rounded-full bg-waikawa-300/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-600/30"></div>
        <div className="absolute -right-32 top-0 h-96 w-96 animate-blob animation-delay-2000 rounded-full bg-waikawa-400/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-700/30"></div>
        <div className="absolute -bottom-32 left-32 h-96 w-96 animate-blob animation-delay-4000 rounded-full bg-waikawa-500/30 mix-blend-multiply blur-xl filter dark:bg-waikawa-800/30"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-center text-waikawa-950 dark:text-waikawa-50">
          PDF Analyzer
        </h1>

        {error && (
          <Card className="mb-4 bg-red-100 dark:bg-red-900/20">
            <CardContent className="p-4 text-red-700 dark:text-red-300">
              {error}
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 bg-white/10 backdrop-blur-md dark:bg-waikawa-800/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-waikawa-900 dark:text-waikawa-100">
              Upload PDF
            </h2>
            <div className="flex items-center space-x-4">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="bg-white/20 text-waikawa-900 dark:text-waikawa-100"
              />
              <Button 
                onClick={handleUpload} 
                disabled={!file || loading}
                className="bg-waikawa-600 text-white hover:bg-waikawa-700 dark:bg-waikawa-300 dark:text-waikawa-950 dark:hover:bg-waikawa-200"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/10 backdrop-blur-md dark:bg-waikawa-800/10">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-waikawa-900 dark:text-waikawa-100">
              Ask a Question
            </h2>
            <div className="space-y-4">
              <select
                value={selectedDocument || ''}
                onChange={(e) => setSelectedDocument(Number(e.target.value))}
                className="w-full rounded bg-white/20 p-2 text-waikawa-900 dark:text-waikawa-100"
              >
                <option value="">Select a document</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                className="bg-white/20 text-waikawa-900 dark:text-waikawa-100"
              />
              <Button 
                onClick={handleAskQuestion} 
                disabled={!selectedDocument || !question || loading}
                className="bg-waikawa-600 text-white hover:bg-waikawa-700 dark:bg-waikawa-300 dark:text-waikawa-950 dark:hover:bg-waikawa-200"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Ask
              </Button>
            </div>
          </CardContent>
        </Card>

        {answer && (
          <Card className="bg-white/10 backdrop-blur-md dark:bg-waikawa-800/10">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-waikawa-900 dark:text-waikawa-100">
                Answer
              </h2>
              <p className="text-waikawa-800 dark:text-waikawa-200">{answer}</p>
            </CardContent>
          </Card>
        )}
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