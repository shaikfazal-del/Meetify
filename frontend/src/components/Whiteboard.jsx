import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Tooltip, Slider, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const colors = ['#ffffff', '#ff4d4d', '#4dff88', '#4d94ff', '#ffff4d', '#ffa64d'];

export default function Whiteboard({ socketRef, isVisible }) {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const [brushSize, setBrushSize] = useState(3);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.offsetWidth === 0) return;

        // Set dimensions considering display scaling
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
    };

    useEffect(() => {
        if (isVisible) {
            // Wait for display: flex to take effect before measuring
            setTimeout(setupCanvas, 100);
        }
    }, [isVisible]);

    useEffect(() => {
        window.addEventListener('resize', setupCanvas);
        return () => window.removeEventListener('resize', setupCanvas);
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize]);

    useEffect(() => {
        if (!socketRef.current) return;

        const handleWhiteboardData = (data) => {
            const { x, y, remoteColor, remoteSize, type } = data;
            
            if (!contextRef.current) return;
            
            contextRef.current.save();
            contextRef.current.strokeStyle = remoteColor;
            contextRef.current.lineWidth = remoteSize;

            if (type === 'start') {
                contextRef.current.beginPath();
                contextRef.current.moveTo(x, y);
            } else if (type === 'draw') {
                contextRef.current.lineTo(x, y);
                contextRef.current.stroke();
            }
            contextRef.current.restore();
        };

        const handleWhiteboardClear = () => {
            if (!contextRef.current || !canvasRef.current) return;
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        };

        socketRef.current.on('whiteboard-data', handleWhiteboardData);
        socketRef.current.on('whiteboard-clear', handleWhiteboardClear);

        return () => {
            socketRef.current.off('whiteboard-data', handleWhiteboardData);
            socketRef.current.off('whiteboard-clear', handleWhiteboardClear);
        };
    }, [socketRef.current, color, brushSize]);

    const getCanvasCoordinates = (e) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        const { x, y } = getCanvasCoordinates(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);

        if (socketRef.current) {
            socketRef.current.emit('whiteboard-data', {
                x,
                y,
                remoteColor: color,
                remoteSize: brushSize,
                type: 'start'
            });
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCanvasCoordinates(e);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();

        if (socketRef.current) {
            socketRef.current.emit('whiteboard-data', {
                x,
                y,
                remoteColor: color,
                remoteSize: brushSize,
                type: 'draw'
            });
        }
    };

    const stopDrawing = () => {
        if (contextRef.current) {
            contextRef.current.closePath();
        }
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (!contextRef.current || !canvasRef.current) return;
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (socketRef.current) {
            socketRef.current.emit('whiteboard-clear');
        }
    };

    return (
        <Box sx={{ 
            display: isVisible ? 'flex' : 'none',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'rgba(15, 15, 26, 0.95)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            {/* Toolbar */}
            <Box sx={{ 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)'
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', ml: 1 }}>Whiteboard</Typography>
                
                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {colors.map((c) => (
                        <IconButton 
                            key={c} 
                            size="small" 
                            onClick={() => setColor(c)}
                            sx={{ 
                                border: color === c ? '2px solid white' : '2px solid transparent',
                                p: 0.2
                            }}
                        >
                            <FiberManualRecordIcon sx={{ color: c, fontSize: '1.2rem' }} />
                        </IconButton>
                    ))}
                </Box>

                <Box sx={{ width: 100, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreateIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                    <Slider 
                        size="small"
                        value={brushSize} 
                        min={1} 
                        max={10} 
                        onChange={(e, v) => setBrushSize(v)} 
                        sx={{ color: 'primary.main' }}
                    />
                </Box>

                <Tooltip title="Clear Board">
                    <IconButton onClick={clearCanvas} sx={{ color: 'error.main' }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Canvas Area */}
            <Box sx={{ flexGrow: 1, position: 'relative', cursor: 'crosshair', height: '100%' }}>
                <canvas
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
                />
            </Box>
        </Box>
    );
}
