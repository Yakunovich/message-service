import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, Typography, Paper, Button, CircularProgress } from '@mui/material';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    orderNum: number;
}

export const MessageHistory: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLastTenMinutes = async () => {
        setLoading(true);
        try {
            const to = new Date();
            const from = new Date(to.getTime() - 10 * 60000);

            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await fetch(
                `${apiUrl}/api/Messages?from=${from.toISOString()}&to=${to.toISOString()}`
            );
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLastTenMinutes();
        const interval = setInterval(fetchLastTenMinutes, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Last 10 Minutes Messages
                </Typography>
                <Button 
                    variant="outlined" 
                    onClick={fetchLastTenMinutes}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Box>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3}>
                    <List>
                        {messages.length === 0 ? (
                            <ListItem>
                                <Typography color="textSecondary">
                                    No messages in the last 10 minutes
                                </Typography>
                            </ListItem>
                        ) : (
                            messages.map((message) => (
                                <ListItem key={message.id} divider>
                                    <Typography>
                                        #{message.orderNum} - {message.text}
                                        <br />
                                        <small>
                                            {new Date(message.timestamp).toLocaleString()}
                                        </small>
                                    </Typography>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
}; 