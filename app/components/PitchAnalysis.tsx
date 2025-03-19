import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  Divider,
  Paper,
} from '@mui/material';

interface PitchAnalysisProps {
  analysis: {
    clarity: number;
    content: number;
    structure: number;
    delivery: number;
    feedback: string;
  };
}

const PitchAnalysis: React.FC<PitchAnalysisProps> = ({ analysis }) => {
  const criteriaItems = [
    { label: 'Clarity', value: analysis.clarity },
    { label: 'Content', value: analysis.content },
    { label: 'Structure', value: analysis.structure },
    { label: 'Delivery', value: analysis.delivery },
  ];

  return (
    <Paper elevation={3} sx={{ maxWidth: '800px', mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        Pitch Analysis Results
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 4 }}>
        {criteriaItems.map((item) => (
          <Card key={item.label} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.label}
              </Typography>
              <Rating
                value={item.value}
                readOnly
                max={5}
                size="large"
                sx={{ color: 'primary.main' }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Score: {item.value}/5
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h5" gutterBottom color="primary">
          Detailed Feedback
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {analysis.feedback}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PitchAnalysis; 