import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Snackbar, Container, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Authentication() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [formState, setFormState] = useState(0); // 0 = Login, 1 = Register
    const [open, setOpen] = useState(false);

    const { handleRegister, handleLogin } = useContext(AuthContext);

    const handleAuth = async () => {
        setError("");
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                let result = await handleRegister(name, username, password);
                setUsername("");
                setPassword("");
                setName("");
                setMessage(result);
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            let msg = err.response?.data?.message || "Something went wrong. Server might be down.";
            setError(msg);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
                <Grid container spacing={0} justifyContent="center" alignItems="stretch">
                    
                    {/* Left Decorative Side */}
                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Box sx={{ 
                            width: '100%',
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)',
                            borderRadius: '16px 0 0 16px',
                            border: '1px solid var(--glass-border)',
                            borderRight: 'none',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 4,
                            textAlign: 'center'
                        }} className="animate-fade-in">
                            <VideocamIcon sx={{ fontSize: '6rem', color: '#8b5cf6', mb: 2 }} />
                            <Typography variant="h3" fontWeight="800" sx={{ color: 'white', mb: 2 }}>
                                Meetify
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                The future of video communication. Fast, secure, and beautiful.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Form Side */}
                    <Grid item xs={12} md={5}>
                        <Paper className="glass-card animate-fade-in" sx={{ 
                            p: { xs: 3, sm: 5 }, 
                            borderRadius: { xs: '16px', md: '0 16px 16px 0' },
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <Box sx={{ p: 2, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', mb: 2 }}>
                                    {formState === 0 ? <LockOutlinedIcon color="primary" fontSize="large" /> : <PersonAddAltIcon color="secondary" fontSize="large" />}
                                </Box>
                                <Typography component="h1" variant="h4" fontWeight="700">
                                    {formState === 0 ? 'Welcome Back' : 'Create Account'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', mb: 4, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', p: 0.5 }}>
                                <Button 
                                    fullWidth 
                                    variant={formState === 0 ? "contained" : "text"} 
                                    onClick={() => setFormState(0)}
                                    color={formState === 0 ? "primary" : "inherit"}
                                >
                                    Sign In
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant={formState === 1 ? "contained" : "text"} 
                                    onClick={() => setFormState(1)}
                                    color={formState === 1 ? "secondary" : "inherit"}
                                >
                                    Sign Up
                                </Button>
                            </Box>

                            <Box component="form" noValidate sx={{ mt: 1 }}>
                                {formState === 1 && (
                                    <TextField margin="normal" required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                                )}
                                <TextField margin="normal" required fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus={formState === 0} />
                                <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2, background: 'rgba(211, 47, 47, 0.2)', color: '#ffb4ab' }}>
                                        {error}
                                    </Alert>
                                )}

                                <Button fullWidth variant="contained" size="large" sx={{ mt: 4, mb: 2, py: 1.5 }} onClick={handleAuth}>
                                    {formState === 0 ? "Login to Account" : "Register Now"}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}