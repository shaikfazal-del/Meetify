import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Container, Grid, Paper,
    useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Divider, IconButton, Snackbar, Alert
} from '@mui/material';
import Navbar from '../components/Navbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import CloseIcon from '@mui/icons-material/Close';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [guestDialogOpen, setGuestDialogOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [newMeetingCode, setNewMeetingCode] = useState('');
    const [copySnackbar, setCopySnackbar] = useState(false);

    const features = [
        { title: 'HD Video', desc: 'Crystal clear video calls with adaptive resolution.', icon: <VideocamIcon fontSize="large" color="primary" /> },
        { title: 'In-Call Chat', desc: 'Share ideas and links via real-time messaging.', icon: <ChatIcon fontSize="large" color="secondary" /> },
        { title: 'Secure', desc: 'End-to-end encryption for your privacy.', icon: <SecurityIcon fontSize="large" color="primary" /> },
    ];

    const handleOpenGuestDialog = () => {
        // Generate a fresh meeting code each time the dialog opens
        const freshCode = Math.random().toString(36).substring(2, 9);
        setNewMeetingCode(freshCode);
        setJoinCode('');
        setJoinError('');
        setGuestDialogOpen(true);
    };

    const handleJoinExisting = () => {
        const code = joinCode.trim();
        if (!code) {
            setJoinError('Please enter a meeting code.');
            return;
        }
        // Support full URLs pasted in — extract just the last segment
        const extracted = code.includes('/') ? code.split('/').pop() : code;
        if (!extracted) {
            setJoinError('Invalid meeting code or link.');
            return;
        }
        setGuestDialogOpen(false);
        router(`/${extracted}`);
    };

    const handleStartNewMeeting = () => {
        setGuestDialogOpen(false);
        router(`/${newMeetingCode}`);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(newMeetingCode).catch(() => {});
        setCopySnackbar(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: isMobile ? 4 : 8 }}>
                <Grid container spacing={isMobile ? 4 : 6} alignItems="center">
                    <Grid item xs={12} md={6} className="animate-fade-in" sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                        <Typography 
                            variant={isMobile ? "h3" : "h2"} 
                            fontWeight="800" 
                            gutterBottom 
                            sx={{ lineHeight: 1.2, mb: 2 }}
                        >
                            Connect with <br />
                            <span className="gradient-text">anyone, anywhere.</span>
                        </Typography>
                        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.6, maxWidth: '600px', mx: isMobile ? 'auto' : 0 }}>
                            Meetify provides premium video conferencing that works flawlessly on any device. Start your secure meeting now.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
                            <Button variant="contained" size="large" onClick={() => router('/auth')} sx={{ px: 4, py: 1.5 }}>
                                Get Started Free
                            </Button>
                            <Button variant="outlined" size="large" onClick={handleOpenGuestDialog} sx={{ px: 4, py: 1.5 }}>
                                Join as Guest
                            </Button>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6} className="animate-fade-in" sx={{ animationDelay: '0.2s', textAlign: 'center' }}>
                        <Box sx={{ 
                            position: 'relative',
                            display: 'inline-block',
                            width: '100%',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                width: '120%',
                                height: '120%',
                                background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 60%)',
                                top: '-10%',
                                left: '-10%',
                                zIndex: 0
                            }
                        }}>
                            <img src="/mobile.png" alt="Video Call Preview" style={{ 
                                width: isMobile ? '100%' : '80%', 
                                maxWidth: isMobile ? '300px' : '400px', 
                                position: 'relative', 
                                zIndex: 1,
                                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' 
                            }} />
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: isMobile ? 8 : 12 }} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Grid container spacing={3}>
                        {features.map((f, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Paper className="glass-card" sx={{ p: isMobile ? 3 : 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <Box sx={{ p: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', mb: 2 }}>
                                        {f.icon}
                                    </Box>
                                    <Typography variant="h5" fontWeight="600" gutterBottom>{f.title}</Typography>
                                    <Typography color="text.secondary" variant="body2">{f.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* ── Guest Join Dialog ─────────────────────────────────────── */}
            <Dialog
                open={guestDialogOpen}
                onClose={() => setGuestDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(15,15,30,0.97)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight="700">Join as Guest</Typography>
                    <IconButton onClick={() => setGuestDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    {/* Option 1 — Join an existing meeting */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                            Join an existing meeting
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                id="guest-meeting-code"
                                placeholder="Enter code or paste link"
                                value={joinCode}
                                onChange={(e) => { setJoinCode(e.target.value); setJoinError(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoinExisting()}
                                error={!!joinError}
                                helperText={joinError}
                                size="small"
                                variant="outlined"
                                InputProps={{ style: { color: 'white' } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&:hover fieldset': { borderColor: 'rgba(139,92,246,0.6)' },
                                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
                                    },
                                    '& .MuiFormHelperText-root': { color: '#f87171' }
                                }}
                            />
                            <Button
                                id="guest-join-btn"
                                variant="contained"
                                onClick={handleJoinExisting}
                                startIcon={<MeetingRoomIcon />}
                                sx={{ whiteSpace: 'nowrap', minWidth: 'fit-content', px: 2 }}
                            >
                                Join
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }}>
                        <Typography variant="caption" color="text.secondary">OR</Typography>
                    </Divider>

                    {/* Option 2 — Start a new meeting */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                            Start a new meeting
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            mb: 2,
                            borderRadius: '8px',
                            background: 'rgba(139,92,246,0.1)',
                            border: '1px solid rgba(139,92,246,0.3)'
                        }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', letterSpacing: 2, color: '#c4b5fd', fontSize: '1rem' }}>
                                {newMeetingCode}
                            </Typography>
                            <IconButton size="small" onClick={handleCopyCode} sx={{ color: '#c4b5fd' }} title="Copy code">
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Button
                            id="guest-new-meeting-btn"
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<VideoCallIcon />}
                            onClick={handleStartNewMeeting}
                            sx={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)',
                                '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #0284c7 100%)' }
                            }}
                        >
                            Start New Meeting
                        </Button>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setGuestDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Copy confirmation snackbar */}
            <Snackbar
                open={copySnackbar}
                autoHideDuration={2000}
                onClose={() => setCopySnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Meeting code copied!
                </Alert>
            </Snackbar>
        </Box>
    );
}
