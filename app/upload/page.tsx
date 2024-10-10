'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Upload, FileText, CheckCircle2 } from "lucide-react"
import axios from 'axios'

interface CsvJson {
  [key: string]: string
}

export default function CSVUploadCard() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (selectedFile: File | null) => {
    setError('')
    setUploadStatus('idle')
    setUploadProgress(0)

    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
      } else {
        setError('Please select a valid CSV file.')
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelection(droppedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file to upload.')
      return
    }

    setUploadStatus('uploading')
    setError('')

    try {
      // Read the file
      const csvText = await file.text()

      // Convert CSV to JSON manually
      const csvToJson = (csv: string): CsvJson[] => {
        const lines = csv.split('\n')
        const headers = lines[0].split(',').map(header => header.trim())
        const jsonData: CsvJson[] = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim())
          const obj: CsvJson = {}
          headers.forEach((header, index) => {
            obj[header] = values[index]
          })
          return obj
        })
        return jsonData
      }

      const jsonResult = csvToJson(csvText)

      // Simulating progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Send JSON data to backend using Axios
      const response = await axios.post('/upload/api/process-data', { data: jsonResult })

      if (response.status === 200) {
        setUploadStatus('success')
        console.log('File uploaded successfully:', file.name)
      }
    } catch (error) {
      setError('An error occurred during upload. Please try again.')
      setUploadStatus('idle')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4'>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Data</CardTitle>
          <CardDescription>Upload registered data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelection(e.target.files?.[0] || null)}
              className="hidden"
            />
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your CSV file here, or click to select
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {file && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>Selected file: {file.name}</AlertDescription>
            </Alert>
          )}
          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
          {uploadStatus === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>File uploaded successfully!</AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploadStatus === 'uploading' || uploadStatus === 'success'} 
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" /> 
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}