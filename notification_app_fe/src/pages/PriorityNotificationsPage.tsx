import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { useMemo, useState } from 'react';
import { PriorityNotificationList } from '../components/PriorityNotificationList';
import { useNotifications } from '../hooks/useNotifications';

const TOP_OPTIONS = [10, 20, 50] as const;

export function PriorityNotificationsPage() {
  const { priorityItems, loading, error, viewedIds, refresh } = useNotifications(50);
  const [top, setTop] = useState<number>(10);

  const visibleNotifications = useMemo(() => priorityItems.slice(0, top), [priorityItems, top]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Priority Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ranked by type priority: Placement, Result, then Event.
            </Typography>
          </Box>

          <ButtonGroup variant="outlined" color="primary" aria-label="select top notifications">
            {TOP_OPTIONS.map((option) => (
              <Button key={option} variant={top === option ? 'contained' : 'outlined'} onClick={() => setTop(option)}>
                Top {option}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={refresh}>Refresh</Button>
        </Stack>

        {loading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
            <CircularProgress />
            <Typography color="text.secondary">Ranking priority notifications...</Typography>
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : visibleNotifications.length === 0 ? (
          <Alert severity="info">No priority notifications available.</Alert>
        ) : (
          <PriorityNotificationList notifications={visibleNotifications} viewedIds={viewedIds} />
        )}
      </Stack>
    </Container>
  );
}
