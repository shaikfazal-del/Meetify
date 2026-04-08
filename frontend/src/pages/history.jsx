import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Typography, Container, Paper, Grid, CircularProgress, Chip } from '@mui/material';
import Navbar from '../components/Navbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import withAuth from '../utils/withAuth';

function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                // Sort by date descending
                const sorted = history.sort((a,b) => new Date(b.date) - new Date(a.date));
                setMeetings(sorted);
            } catch (err) {
                console.log("Error fetching history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <Container maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    Meeting History
                    <Chip label={meetings.length} color="primary" sx={{ ml: 2, fontWeight: 'bold' }} />
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : meetings.length === 0 ? (
                    <Paper className="glass-card animate-fade-in" sx={{ p: 6, textAlign: 'center' }}>
                        <VideocamIcon sx={{ fontSize: '4rem', color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No meetings found</Typography>
                        <Typography color="text.disabled">Join a meeting to see your history here.</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {meetings.map((e, i) => (
                            <Grid item xs={12} key={i}>
                                <Paper className="glass-card animate-fade-in" sx={{ 
                                    p: 3, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    animationDelay: `${i * 0.05}s`
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ p: 1.5, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', mr: 3 }}>
                                            <VideocamIcon color="primary" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                                                Meeting Code: <span className="gradient-text">{e.meetingCode}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarMonthIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                                {formatDate(e.date)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default withAuth(History);
