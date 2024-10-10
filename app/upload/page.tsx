'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Upload, FileText, CheckCircle2 } from "lucide-react"
import axios from 'axios'
import * as XLSX from 'xlsx'

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
      setError('Please select a CSV or Excel file to upload.');
      return;
    }
  
    setUploadStatus('uploading');
    setError('');
  
    try {
      let jsonResult: CsvJson[] = [];
  
      if (file.name.endsWith('.csv')) {
        // Read the CSV file
        const csvText = await file.text();
  
        // Convert CSV to JSON
        const csvToJson = (csv: string): CsvJson[] => {
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          const jsonData: CsvJson[] = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            const obj: CsvJson = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || ''; // Handle missing values
            });
            return obj;
          });
          return jsonData;
        };
  
        jsonResult = csvToJson(csvText);
      } else if (file.name.endsWith('.xlsx')) {
        // Read the Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
        // Assuming the data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // Convert Excel to JSON
        jsonResult = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).map(row => {
          const obj: CsvJson = {};
          row.forEach((cell, index) => {
            obj[`Column ${index + 1}`] = cell || ''; // Use dynamic keys for Excel columns
          });
          return obj;
        });
      } else {
        setError('Unsupported file format. Please upload a CSV or Excel file.');
        setUploadStatus('idle');
        return;
      }
  
      // console.log('Converted file to JSON:', jsonResult);
  
      // Filter to include only required fields
      const filteredResult = jsonResult.map(item => ({
        'Team Name': item['Team Name'] || '',
        'Candidate Name': item["Candidate's Name"] || '',
        'Candidate Email': item["Candidate's Email"] || ''
      }));
  
      console.log('Filtered JSON data:', filteredResult);
  
      // Simulating progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
  
      // Send filtered JSON data to backend using Axios
      const response = await axios.post('/upload/api/process-data', { data: filteredResult });
  
      if (response.status === 200) {
        setUploadStatus('success');
        console.log('File uploaded successfully:', file.name);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setError('An error occurred during upload. Please try again.');
      setUploadStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
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
              onChange={(e) => handleFileSelection(e.target.files?.[0] || null)}
              className="hidden"
            />
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your CSV or Excel file here, or click to select
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