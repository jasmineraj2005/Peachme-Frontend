import React from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PeachMe
        </Typography>
        <Box>
          <Link href="/" passHref>
            <Button color="inherit" sx={{ mr: 2 }}>
              Home
            </Button>
          </Link>
          <Link href="/chat" passHref>
            <Button color="inherit" sx={{ mr: 2 }}>
              Chat
            </Button>
          </Link>
          <Link href="/pitch-analysis" passHref>
            <Button color="inherit">
              Pitch Analysis
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 