import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#a855f7', // Aesthetic Purple
        },
        secondary: {
            main: '#0ea5e9', // Aesthetic Blue
        },
        background: {
            default: '#050505', // Deep dark background
            paper: 'rgba(255, 255, 255, 0.02)', // Refined glass effect
        },
        text: {
            primary: '#fafafa',
            secondary: '#a1a1aa',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                    },
                },
                contained: {
                    background: 'linear-gradient(45deg, #a855f7 30%, #0ea5e9 90%)',
                    color: 'white',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#8b5cf6',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
