import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { NotificationCard } from '../components/NotificationCard';
import { NotificationFilter } from '../components/NotificationFilter';
import { Pagination } from '../components/Pagination';
import { useNotifications } from '../hooks/useNotifications';

export function AllNotificationsPage() {
  const {
    items,
    loading,
    error,
    page,
    limit,
    type,
    viewedIds,
    hasNextPage,
    setPage,
    setLimit,
    setType,
    refresh,
    markAsViewed
  } = useNotifications(8);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              All Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse campus notifications with read state tracking and pagination.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Viewed: ${viewedIds.size}`} color="success" variant="outlined" />
            <Chip label={`Page size: ${limit}`} variant="outlined" />
          </Stack>
        </Stack>

        <NotificationFilter
          type={type}
          limit={limit}
          onTypeChange={(value) => {
            setPage(1);
            setType(value);
          }}
          onLimitChange={(value) => {
            setPage(1);
            setLimit(value);
          }}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={refresh}>
            Refresh
          </Button>
        </Stack>

        {loading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
            <CircularProgress />
            <Typography color="text.secondary">Loading notifications...</Typography>
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : items.length === 0 ? (
          <Alert severity="info">No notifications found.</Alert>
        ) : (
          <Grid container spacing={2}>
            {items.map((notification) => (
              <Grid item xs={12} sm={6} lg={4} key={notification.ID}>
                <Box onClick={() => markAsViewed(notification.ID)} sx={{ cursor: 'pointer' }}>
                  <NotificationCard notification={notification} viewed={viewedIds.has(notification.ID)} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        <Pagination page={page} hasNextPage={hasNextPage} onPageChange={setPage} />
      </Stack>
    </Container>
  );
}
