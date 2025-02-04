import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, Typography, Paper } from '@mui/material';
import * as signalR from '@microsoft/signalr';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    orderNum: number;
}

export const MessageViewer: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:5000';
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${wsUrl}/messageHub`)
            .withAutomaticReconnect()
            .build();

        connection.on('ReceiveMessage', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        connection.start()
            .catch(err => console.error('Error while connecting to SignalR:', err));

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Real-time Messages
            </Typography>
            <Paper elevation={3}>
                <List>
                    {messages.map((message) => (
                        <ListItem key={message.id} divider>
                            <Typography>
                                #{message.orderNum} - {message.text}
                                <br />
                                <small>
                                    {new Date(message.timestamp).toLocaleString()}
                                </small>
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}; 