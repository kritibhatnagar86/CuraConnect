import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const ReviewModal = ({ open, onClose, onSubmit, doctorName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    onSubmit(rating, review);
    setRating(0);
    setReview('');
    setError('');
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
        Leave a Review for {doctorName}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          {[1,2,3,4,5].map((star) => (
            <IconButton
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(-1)}
              sx={{ color: (hover >= star || rating >= star) ? '#FFD700' : '#757575', fontSize: 32 }}
            >
              <StarIcon fontSize="large" />
            </IconButton>
          ))}
        </Box>
        <TextField
          label="Your Review (optional)"
          multiline
          minRows={3}
          fullWidth
          value={review}
          onChange={e => setReview(e.target.value)}
          sx={{ mb: 2, color: 'white' }}
          InputProps={{ sx: { color: 'white' } }}
          InputLabelProps={{ sx: { color: 'white' } }}
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
        <Button onClick={handleClose} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#8B5CF6' }}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal; 