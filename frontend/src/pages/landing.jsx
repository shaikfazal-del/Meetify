import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const features = [
        { title: 'HD Video', desc: 'Crystal clear video calls with adaptive resolution.', icon: <VideocamIcon fontSize="large" color="primary" /> },
        { title: 'In-Call Chat', desc: 'Share ideas and links via real-time messaging.', icon: <ChatIcon fontSize="large" color="secondary" /> },
        { title: 'Secure', desc: 'End-to-end encryption for your privacy.', icon: <SecurityIcon fontSize="large" color="primary" /> },
    ];

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
                            <Button variant="outlined" size="large" onClick={() => router('/aljk23')} sx={{ px: 4, py: 1.5 }}>
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
        </Box>
    );
}

