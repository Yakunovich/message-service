import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MessageSender } from './components/MessageSender.tsx';
import { MessageViewer } from './components/MessageViewer.tsx';
import { MessageHistory } from './components/MessageHistory.tsx';
import { Container, AppBar, Toolbar, Button, Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Send Messages
          </Button>
          <Button color="inherit" component={Link} to="/view">
            View Real-time
          </Button>
          <Button color="inherit" component={Link} to="/history">
            Last 10 Minutes
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<MessageSender />} />
            <Route path="/view" element={<MessageViewer />} />
            <Route path="/history" element={<MessageHistory />} />
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;
