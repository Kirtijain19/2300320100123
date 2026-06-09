import { AppBar, Box, Button, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { AllNotificationsPage } from './pages/AllNotificationsPage';
import { PriorityNotificationsPage } from './pages/PriorityNotificationsPage';

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(12px)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Tabs value={tab} onChange={(_event, value) => setTab(value)} textColor="primary" indicatorColor="primary" variant="scrollable" allowScrollButtonsMobile>
            <Tab label="All Notifications" />
            <Tab label="Priority Notifications" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        {tab === 0 ? <AllNotificationsPage /> : <PriorityNotificationsPage />}
      </Container>
    </Box>
  );
}
