import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar, Button, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import withAuth from '../utils/withAuth';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

function Profile() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [historyCount, setHistoryCount] = useState(0);
    const navigate = useNavigate();

    // Since we don't have a specific API exposing user name, we'll derive it from history
    // or just show a generic "My Profile" until the backend is updated.
    
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setHistoryCount(history.length);
            } catch (err) {
                console.log(err);
            }
        };
        fetchHistory();
    }, [getHistoryOfUser]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper className="glass-card animate-fade-in" sx={{ p: 4, textAlign: 'center' }}>
                            <Avatar sx={{ 
                                width: 120, 
                                height: 120, 
                                mx: 'auto', 
                                mb: 3, 
                                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                                fontSize: '3rem',
                                border: '4px solid rgba(255,255,255,0.1)'
                            }}>
                                U
                            </Avatar>
                            <Typography variant="h5" fontWeight="700" mb={1}>User Profile</Typography>
                            <Typography color="text.secondary" mb={4}>Member</Typography>
                            
                            <Button 
                                variant="outlined" 
                                color="error" 
                                fullWidth 
                                startIcon={<LogoutIcon />}
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/auth');
                                }}
                            >
                                Sign Out
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper className="glass-card animate-fade-in" sx={{ p: 4, animationDelay: '0.1s', height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" fontWeight="600">Account Details</Typography>
                                <Button startIcon={<SettingsIcon />} sx={{ color: 'text.secondary' }}>Edit</Button>
                            </Box>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />
                            
                            <Grid container spacing={4} mb={6}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 3, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography color="text.secondary" mb={1}>Total Meetings</Typography>
                                        <Typography variant="h3" fontWeight="800" color="primary">{historyCount}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 3, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography color="text.secondary" mb={1}>Account Status</Typography>
                                        <Typography variant="h4" fontWeight="700" color="secondary">Active</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" fontWeight="600" mb={2}>Quick Actions</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" onClick={() => navigate('/home')}>Go to Dashboard</Button>
                                <Button variant="outlined" onClick={() => navigate('/history')}>View Full History</Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default withAuth(Profile);
