import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Grid, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [historyCount, setHistoryCount] = useState(0);

    const { addToUserHistory, getHistoryOfUser } = useContext(AuthContext);

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
    }, []);

    const handleJoinVideoCall = async () => {
        if (!meetingCode) return;
        
        let code = meetingCode;
        if (code.includes('/')) {
            code = code.split('/').pop();
        }
        
        try {
            await addToUserHistory(code);
        } catch (err) {
            console.log(err);
        }
        navigate(`/${code}`);
    };

    const handleCreateNewMeeting = () => {
        const newCode = Math.random().toString(36).substring(2, 9);
        setMeetingCode(newCode);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={7} className="animate-fade-in">
                        <Typography variant="h3" fontWeight="800" gutterBottom>
                            Premium video meetings. <br />
                            <span className="gradient-text">Now free for everyone.</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.2rem', maxWidth: '600px' }}>
                            We re-engineered the service we built for secure business meetings, Meetify, to make it free and available for all.
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                startIcon={<VideoCallIcon />}
                                sx={{ py: 1.5, px: 3, fontSize: '1.1rem' }}
                                onClick={handleCreateNewMeeting}
                            >
                                New Meeting
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Paper className="glass-card" sx={{ p: '4px 12px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}>
                                    <KeyboardIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                    <TextField 
                                        variant="standard"
                                        placeholder="Enter a code or link"
                                        value={meetingCode}
                                        onChange={(e) => setMeetingCode(e.target.value)}
                                        InputProps={{ disableUnderline: true, style: { color: 'white' } }}
                                        sx={{ width: '200px' }}
                                    />
                                </Paper>
                                <Button 
                                    variant="outlined" 
                                    size="large" 
                                    disabled={!meetingCode}
                                    onClick={handleJoinVideoCall}
                                    sx={{ height: '48px' }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 4 }}>
                            <Box>
                                <Typography variant="h4" fontWeight="700" color="primary">{historyCount}</Typography>
                                <Typography color="text.secondary">Total Meetings Joined</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5} className="animate-fade-in" sx={{ animationDelay: '0.2s', textAlign: 'center' }}>
                        <Paper className="glass-card" sx={{ p: 0, overflow: 'hidden', borderRadius: '24px', position: 'relative' }}>
                            <img src="/logo3.png" alt="Video Call Concept" style={{ width: '100%', display: 'block', opacity: 0.9 }} />
                            <Box sx={{ 
                                position: 'absolute', 
                                bottom: 0, left: 0, right: 0, 
                                p: 3, 
                                background: 'linear-gradient(to top, rgba(15,15,26,1), transparent)'
                            }}>
                                <Typography variant="h6" fontWeight="bold">Stay Connected</Typography>
                                <Typography variant="body2" color="text.secondary">Secure HD Video conferencing</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default withAuth(HomeComponent);