'use client';

import { useState } from 'react';
import {Box, TextField, Button, Typography, Paper, IconButton, Alert} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function Home() {
  const [alias, setAlias] = useState('');
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!/^https:\/\/www\./.test(url)) {
      setFeedback({ message: 'Invalid URL. Ensure it starts with https://www.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/madeAlias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias, url }),
      });

      const result = await response.json();

      if (response.ok) {
        const baseUrl = window.location.origin;
        setShortUrl(`${baseUrl}/${alias}`);
        setFeedback({ message: 'Short URL created successfully!', type: 'success' });
      } else {
        setFeedback({ message: result.error || 'Failed to create alias.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback({ message: 'An unexpected error occurred.', type: 'error' });
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setFeedback({ message: 'Short URL copied to clipboard.', type: 'success' });
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 900,
          width: '100%',
          padding: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to my URL Shortener!
        </Typography>
        <form onSubmit={handleSubmit}>
        <TextField
        fullWidth
        label="Enter your Alias"
        variant="filled"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        required
        sx={{
          mb: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          '& .MuiFilledInput-root': {
            bgcolor: '#e0f7fa',
          },
        }}
      />
      <TextField
        fullWidth
        label="Enter your URL"
        variant="filled"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        sx={{
          mb: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          '& .MuiFilledInput-root': {
            bgcolor: '#ffe0b2',
          },
        }}
      />
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        type="submit"
        sx={{
            mb: 3,
            bgcolor: '#7b1fa2',
            color: '#fff',
            '&:hover': {
              bgcolor: '#4a0072',
            },
          }}
      >
          Create Alias
      </Button>
  </form>
{feedback && (
  <Alert
    severity={feedback.type}
    sx={{
      mb: 3,
      bgcolor: feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
      color: feedback.type === 'success' ? '#2e7d32' : '#c62828',
    }}
  >
    {feedback.message}
  </Alert>
)}
{shortUrl && (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mt: 2,
      p: 1,
      border: '1px solid #cfd8dc',
      borderRadius: 2,
      bgcolor: '#f1f8e9',
    }}
  >
      <Typography variant="body1" sx={{ mr: 1 }}>
        {shortUrl}
      </Typography>
      <IconButton color="primary" aria-label="copy to clipboard" onClick={copyToClipboard}>
        <ContentCopyIcon />
      </IconButton>
      </Box>
        )}
      </Paper>
    </Box>
  );
}
