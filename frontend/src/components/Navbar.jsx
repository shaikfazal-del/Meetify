import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
        setDrawerOpen(false);
    };

    const navItems = [
        { label: 'Features', path: '/features' },
        { label: 'Roadmap', path: '/roadmap' },
        { label: 'About', path: '/about' },
    ];

    if (isAuthenticated) {
        navItems.push({ label: 'Dashboard', path: '/home' });
        navItems.push({ label: 'History', path: '/history' });
    }

    const handleNav = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <AppBar position="sticky" sx={{ 
            background: 'rgba(15, 15, 26, 0.8)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.drawer + 1
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', padding: isMobile ? '0.5rem 1.5rem' : '0.5rem 2rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <VideocamIcon sx={{ color: '#8b5cf6', fontSize: isMobile ? '1.5rem' : '2rem', mr: 1 }} />
                    <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                        Meetify
                    </Typography>
                </Box>
                
                {isMobile ? (
                    <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Button 
                                key={item.path}
                                color="inherit" 
                                onClick={() => navigate(item.path)} 
                                sx={{ opacity: location.pathname === item.path ? 1 : 0.7 }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        
                        {isAuthenticated ? (
                            <>
                                <IconButton onClick={() => navigate('/profile')} sx={{ ml: 1, border: '2px solid #8b5cf6' }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }} />
                                </IconButton>
                                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ ml: 2 }}>Logout</Button>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                                <Button variant="outlined" onClick={() => navigate('/auth')}>Sign In</Button>
                                <Button variant="contained" onClick={() => navigate('/auth')}>Sign Up</Button>
                            </Box>
                        )}
                    </Box>
                )}

                <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{
                        sx: { width: '280px', background: '#0f0f1a', borderLeft: '1px solid rgba(255,255,255,0.1)' }
                    }}
                >
                    <Box sx={{ pt: 2, px: 2, pb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <List>
                            {navItems.map((item) => (
                                <ListItem button key={item.path} onClick={() => handleNav(item.path)}>
                                    <ListItemText 
                                        primary={item.label} 
                                        primaryTypographyProps={{ 
                                            sx: { color: location.pathname === item.path ? '#8b5cf6' : 'white', fontWeight: 600 } 
                                        }} 
                                    />
                                </ListItem>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <ListItem button onClick={() => handleNav('/profile')}>
                                        <ListItemText primary="Profile" sx={{ color: 'white' }} />
                                    </ListItem>
                                    <ListItem sx={{ mt: 4 }}>
                                        <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
                                    </ListItem>
                                </>
                            ) : (
                                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button fullWidth variant="outlined" onClick={() => handleNav('/auth')}>Sign In</Button>
                                    <Button fullWidth variant="contained" onClick={() => handleNav('/auth')}>Sign Up</Button>
                                </Box>
                            )}
                        </List>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

