import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
        }}>
            <Container maxWidth="sm" className="animate-fade-in" sx={{ 
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                p: 6,
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
                <ReportProblemOutlinedIcon sx={{ fontSize: '6rem', color: '#8b5cf6', mb: 2 }} />
                
                <Typography variant="h1" fontWeight="900" sx={{ mb: 1, textShadow: '0 4px 20px rgba(139, 92, 246, 0.5)' }}>
                    404
                </Typography>
                
                <Typography variant="h4" fontWeight="600" mb={2}>
                    Page Not Found
                </Typography>
                
                <Typography color="text.secondary" paragraph mb={4} lineHeight={1.6}>
                    The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
                </Typography>
                
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/')}
                    sx={{ px: 4, py: 1.5, borderRadius: '30px' }}
                >
                    Return to Homepage
                </Button>
            </Container>
        </Box>
    );
}
