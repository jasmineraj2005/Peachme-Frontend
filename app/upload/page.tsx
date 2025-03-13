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
  const [structuredFeedback, setStructuredFeedback] = useState<any>(null); // ✅ NEW state for structured feedback
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
    setStructuredFeedback(null); // clear previous feedback
    setTranscript(null);

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
      setTranscript(data.transcript);
      setStructuredFeedback(data.structured_feedback); // ✅ Store structured feedback
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

        {error && <div className="bg-red-100 p-4 text-red-700">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="video">Video File</Label>
            <div
              className="border border-dashed p-4"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? file.name : "Click to browse video"}
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

          <Button type="submit" disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>

        {transcript && (
          <div className="p-4 bg-secondary rounded-md">
            <h2 className="text-xl font-semibold">Transcript</h2>
            <pre>{transcript}</pre>
            <Button onClick={downloadTranscript}>Download as TXT</Button>
          </div>
        )}

        {structuredFeedback && ( // ✅ Clearly show structured feedback
          <div className="p-4 bg-secondary rounded-md">
            <h2 className="text-xl font-semibold">Structured Feedback</h2>
            <pre>{JSON.stringify(structuredFeedback, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
