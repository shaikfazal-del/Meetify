import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
import ExtensionIcon from '@mui/icons-material/Extension';

export default function Roadmap() {
    const upcomingFeatures = [
        { title: 'AI Meeting Summaries', desc: 'Automatically generate accurate meeting summaries and action items using advanced AI.', icon: <AutoAwesomeIcon fontSize="large" color="primary" /> },
        { title: 'Breakout Rooms', desc: 'Split your large meetings into smaller groups for focused discussions and workshops.', icon: <GroupAddIcon fontSize="large" color="secondary" /> },
        { title: 'Live Closed Captions', desc: 'Real-time subtitles during your meetings for better accessibility and comprehension.', icon: <ClosedCaptionIcon fontSize="large" color="primary" /> },
        { title: 'Third-Party Integrations', desc: 'Connect to your favorite tools like Slack, Google Calendar, and Trello directly from Meetify.', icon: <ExtensionIcon fontSize="large" color="secondary" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box textAlign="center" mb={8} className="animate-fade-in">
                    <Typography variant="h2" fontWeight="800" mb={3}>
                        Product <span className="gradient-text">Roadmap</span>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="800px" mx="auto">
                        Here's a sneak peek into what we are building next to make Meetify even better.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {upcomingFeatures.map((f, i) => (
                        <Grid item xs={12} sm={6} md={6} key={i}>
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
