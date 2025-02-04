import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';

export const MessageSender: React.FC = () => {
    const [text, setText] = useState('');
    const [currentOrderNum, setCurrentOrderNum] = useState(1);
    const [manualOrderNum, setManualOrderNum] = useState('');
    const [isAutoNumber, setIsAutoNumber] = useState(true);
    const [startNumber, setStartNumber] = useState('1');
    const [isSettingStart, setIsSettingStart] = useState(false);

    const handleSubmit = async () => {
        try {
            const orderNum = isAutoNumber ? currentOrderNum : parseInt(manualOrderNum);
            await fetch('http://localhost:5000/api/Messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    orderNum
                }),
            });
            setText('');
            if (isAutoNumber) {
                setCurrentOrderNum(prev => prev + 1);
            } else {
                setManualOrderNum('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleStartNumberChange = () => {
        setCurrentOrderNum(parseInt(startNumber));
        setIsSettingStart(false);
    };

    return (
        <Box sx={{ p: 2 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isAutoNumber}
                        onChange={(e) => setIsAutoNumber(e.target.checked)}
                    />
                }
                label="Auto-increment message number"
            />
            
            {isAutoNumber && (
                <Box sx={{ mb: 2 }}>
                    {isSettingStart ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                label="Start from"
                                type="number"
                                value={startNumber}
                                onChange={(e) => setStartNumber(e.target.value)}
                                size="small"
                            />
                            <Button onClick={handleStartNumberChange} variant="outlined" size="small">
                                Set
                            </Button>
                            <Button onClick={() => setIsSettingStart(false)} size="small">
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="h6">
                                Current Message Number: {currentOrderNum}
                            </Typography>
                            <Button onClick={() => setIsSettingStart(true)} size="small">
                                Change
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
            
            {!isAutoNumber && (
                <TextField
                    fullWidth
                    label="Message Number"
                    type="number"
                    value={manualOrderNum}
                    onChange={(e) => setManualOrderNum(e.target.value)}
                    margin="normal"
                />
            )}

            <TextField
                fullWidth
                label="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" onClick={handleSubmit}>
                Send Message
            </Button>
        </Box>
    );
};
