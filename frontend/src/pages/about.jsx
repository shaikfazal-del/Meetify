import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';

export default function About() {
    const team = [
        { name: 'Alex Johnson', role: 'Founder & CEO', initials: 'AJ' },
        { name: 'Samantha Lee', role: 'Head of Product', initials: 'SL' },
        { name: 'Michael Chen', role: 'Lead Engineer', initials: 'MC' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box textAlign="center" mb={10} className="animate-fade-in">
                    <Typography variant="h2" fontWeight="800" mb={4}>
                        About <span className="gradient-text">Meetify</span>
                    </Typography>
                    <Typography variant="h5" color="text.secondary" maxWidth="800px" mx="auto" lineHeight={1.8}>
                        We believe that connecting with people should be effortless. Our mission is to break down distance barriers by providing the highest quality video communication platform in the world, completely free.
                    </Typography>
                </Box>

                <Grid container spacing={6} alignItems="center" mb={10}>
                    <Grid item xs={12} md={6} className="animate-fade-in">
                        <Paper className="glass-card" sx={{ p: 4 }}>
                            <Typography variant="h4" fontWeight="700" mb={3}>Our Story</Typography>
                            <Typography color="text.secondary" paragraph lineHeight={1.8}>
                                Meetify was born out of frustration with clunky, expensive enterprise software. We wanted to create a tool that anyone could use, right from their browser, without needing to install complicated apps or pay hefty subscriptions.
                            </Typography>
                            <Typography color="text.secondary" lineHeight={1.8}>
                                Today, thousands of people rely on our secure network to talk with family, collaborate with coworkers, and learn from teachers across the globe.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} className="animate-fade-in" sx={{ animationDelay: '0.2s', textAlign: 'center' }}>
                        <img src="/mobile.png" alt="About US" style={{ maxWidth: '80%', filter: 'hue-rotate(45deg) drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
                    </Grid>
                </Grid>

                <Box textAlign="center" mb={6} className="animate-fade-in" sx={{ animationDelay: '0.4s' }}>
                    <Typography variant="h3" fontWeight="700" mb={6}>Meet The Team</Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {team.map((member, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Paper className="glass-card" sx={{ p: 4, textAlign: 'center', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-10px)' } }}>
                                    <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 3, background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)', fontSize: '2rem' }}>
                                        {member.initials}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="600" mb={1}>{member.name}</Typography>
                                    <Typography color="text.secondary">{member.role}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
