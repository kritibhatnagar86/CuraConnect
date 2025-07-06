import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as FileIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';

const FileUpload = ({ appointmentId, onFileUploaded, onFileDeleted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Fetch files when component mounts
  React.useEffect(() => {
    if (appointmentId) {
      fetchFiles();
    }
  }, [appointmentId]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/files/${appointmentId}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('uploadedBy', 'patient');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/upload/${appointmentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      setSuccess('File uploaded successfully!');
      setSelectedFile(null);
      setDescription('');
      setShowUploadDialog(false);
      
      // Refresh files list
      await fetchFiles();
      
      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(response.data.file);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`http://localhost:5000/api/files/${fileId}`);
        setFiles(files.filter(file => file.id !== fileId));
        
        // Notify parent component
        if (onFileDeleted) {
          onFileDeleted(fileId);
        }
        
        setSuccess('File deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Error deleting file');
      }
    }
  };

  const handleDownload = (file) => {
    window.open(`http://localhost:5000${file.downloadUrl}`, '_blank');
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon />;
    }
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setShowUploadDialog(true)}
          sx={{
            bgcolor: '#8B5CF6',
            '&:hover': { bgcolor: '#7C3AED' }
          }}
        >
          Upload File
        </Button>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onClose={() => setShowUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#18122B', color: '#8B5CF6' }}>
          Upload File
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 2, borderColor: '#8B5CF6', color: '#8B5CF6' }}
              >
                Choose File
              </Button>
            </label>
            
            {selectedFile && (
              <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Typography>
            )}

            <TextField
              fullWidth
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'white' }
              }}
            />

            {uploading && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
          <Button onClick={() => setShowUploadDialog(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            sx={{ bgcolor: '#8B5CF6', color: 'white', '&:hover': { bgcolor: '#7C3AED' } }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Files List */}
      {files.length > 0 && (
        <Paper sx={{ bgcolor: '#18122B', color: 'white', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#8B5CF6' }}>
            Uploaded Files
          </Typography>
          <List>
            {files.map((file) => (
              <ListItem key={file.id} sx={{ borderBottom: '1px solid #2D1B69' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getFileIcon(file.fileType)}
                </Box>
                <ListItemText
                  primary={file.originalName}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString()}
                      </Typography>
                      {file.description && (
                        <Typography variant="body2" color="text.secondary">
                          {file.description}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDownload(file)}
                    sx={{ color: '#8B5CF6', mr: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(file.id)}
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload; 