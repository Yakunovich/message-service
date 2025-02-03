import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export const MessageSender: React.FC = () => {
    const [text, setText] = useState('');
    const [orderNum, setOrderNum] = useState('');

    const handleSubmit = async () => {
        try {
            await fetch('http://localhost:5000/api/Messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    orderNum: parseInt(orderNum)
                }),
            });
            setText('');
            setOrderNum('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <TextField
                fullWidth
                label="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Order Number"
                type="number"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" onClick={handleSubmit}>
                Send Message
            </Button>
        </Box>
    );
};
