import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import DevicesIcon from '@mui/icons-material/Devices';

export default function Features() {
    const featuresList = [
        { title: 'HD Video & Audio', desc: 'Experience crystal clear meetings with our adaptive bandwidth technology that ensures smooth streaming.', icon: <VideocamIcon fontSize="large" color="primary" /> },
        { title: 'In-Call Chat', desc: 'Share ideas, links, and text instantly using the built-in real-time lobby chat.', icon: <ChatIcon fontSize="large" color="secondary" /> },
        { title: 'Screen Sharing', desc: 'Present documents or collaborate on code easily by sharing your entire screen or specific windows.', icon: <ScreenShareIcon fontSize="large" color="primary" /> },
        { title: 'End-to-End Security', desc: 'Your meetings are private and secure, encrypted from start to finish.', icon: <SecurityIcon fontSize="large" color="secondary" /> },
        { title: 'Meeting History', desc: 'Automatically keep track of all the past meetings you have attended in your dashboard.', icon: <HistoryIcon fontSize="large" color="primary" /> },
        { title: 'Cross-Platform', desc: 'Works inside the browser without installing anything. Perfect for desktop and mobile.', icon: <DevicesIcon fontSize="large" color="secondary" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box textAlign="center" mb={8} className="animate-fade-in">
                    <Typography variant="h2" fontWeight="800" mb={3}>
                        Powerful <span className="gradient-text">Features</span>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="800px" mx="auto">
                        Everything you need to host perfect video meetings, built directly into your browser.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {featuresList.map((f, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Paper className="glass-card animate-fade-in" sx={{ p: 4, height: '100%', animationDelay: `${i * 0.1}s` }}>
                                <Box sx={{ p: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', mb: 2 }}>
                                    {f.icon}
                                </Box>
                                <Typography variant="h5" fontWeight="700" mb={2}>{f.title}</Typography>
                                <Typography color="text.secondary" lineHeight={1.6}>{f.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
