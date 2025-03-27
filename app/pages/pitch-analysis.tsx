import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import PitchAnalysis from '../components/PitchAnalysis';

interface AnalysisResult {
  clarity: number;
  content: number;
  structure: number;
  delivery: number;
  feedback: string;
}

const PitchAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, upload and transcribe the video
      const formData = new FormData();
      formData.append('video', file);
      formData.append('save_to_conversation', 'true');

      const transcribeResponse = await fetch('/api/video/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error('Failed to transcribe video');
      }

      const transcribeData = await transcribeResponse.json();

      // Then, analyze the transcript
      const analyzeResponse = await fetch('/api/video/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcribeData.transcript,
          conversation_id: transcribeData.conversation_id,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to analyze pitch');
      }

      const analyzeData = await analyzeResponse.json();
      
      // Parse the analysis results from the response
      const analysisText = analyzeData.feedback;
      const analysisResult = parseAnalysisResponse(analysisText);
      setAnalysis(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse the analysis response text into structured data
  const parseAnalysisResponse = (text: string): AnalysisResult => {
    const lines = text.split('\n');
    const result: Partial<AnalysisResult> = {};

    lines.forEach(line => {
      if (line.includes('Clarity:')) result.clarity = parseInt(line.split(':')[1]);
      if (line.includes('Content:')) result.content = parseInt(line.split(':')[1]);
      if (line.includes('Structure:')) result.structure = parseInt(line.split(':')[1]);
      if (line.includes('Delivery:')) result.delivery = parseInt(line.split(':')[1]);
      if (line.includes('Detailed Feedback:')) {
        result.feedback = lines.slice(lines.indexOf(line) + 1).join('\n').trim();
      }
    });

    return result as AnalysisResult;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        Pitch Analysis
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <input
          accept="video/*"
          style={{ display: 'none' }}
          id="video-upload"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="video-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            disabled={loading}
          >
            Select Video
          </Button>
        </label>

        {file && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Selected file: {file.name}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? 'Processing...' : 'Analyze Pitch'}
            </Button>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {analysis && <PitchAnalysis analysis={analysis} />}
    </Container>
  );
};

export default PitchAnalysisPage; 