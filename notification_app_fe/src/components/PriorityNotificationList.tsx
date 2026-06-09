import { Grid, Typography } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import { PriorityNotification } from '../types/notification';

interface PriorityNotificationListProps {
  notifications: PriorityNotification[];
  viewedIds: Set<string>;
}

export function PriorityNotificationList({ notifications, viewedIds }: PriorityNotificationListProps) {
  if (notifications.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        No priority notifications available.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {notifications.map((notification) => (
        <Grid item xs={12} md={6} key={notification.ID}>
          <NotificationCard notification={notification} viewed={viewedIds.has(notification.ID)} />
        </Grid>
      ))}
    </Grid>
  );
}
