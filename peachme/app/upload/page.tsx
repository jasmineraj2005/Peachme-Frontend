"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Please select a video file before uploading.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data.transcript); // ✅ Fixed typo from "transript"
    } catch (error) {
      console.error("Upload error:", error);
      setError("Error uploading video. Please try again.");
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };

  // ✅ Function to download transcript as a .txt file
  const downloadTranscript = () => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transcript.txt";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold">Upload a Test Video</h1>
        <p className="text-muted-foreground">
          This page will send your video to the Django backend and return a transcript.
        </p>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video">Video File</Label>
            <div
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-input p-12 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-sm font-medium">
                {file ? file.name : "Drag and drop your video here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">Supports MP4, MOV, AVI</p>
              <Input
                ref={fileInputRef}
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>

        {transcript && (
          <div className="mt-6 p-4 border rounded-md bg-secondary">
            <h2 className="text-xl font-semibold">Transcript:</h2>
            <p className="text-sm whitespace-pre-wrap">{transcript}</p>
            {/* ✅ Download button */}
            <Button onClick={downloadTranscript} className="mt-4">
              Download as TXT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}