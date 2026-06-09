import BookmarkIcon from '@mui/icons-material/Bookmark';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { NotificationItem } from '../types/notification';

interface NotificationCardProps {
  notification: NotificationItem;
  viewed: boolean;
}

function getTypeColor(type: string): 'error' | 'warning' | 'info' {
  const normalized = type.toLowerCase();
  if (normalized === 'placement') return 'error';
  if (normalized === 'result') return 'warning';
  return 'info';
}

export function NotificationCard({ notification, viewed }: NotificationCardProps) {
  const tone = getTypeColor(notification.Type);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: viewed ? 'divider' : `${tone}.main`,
        background: viewed ? 'background.paper' : 'rgba(25, 118, 210, 0.04)',
        boxShadow: viewed ? 'none' : '0 10px 30px rgba(15, 23, 42, 0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 34px rgba(15, 23, 42, 0.10)'
        }
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap">
              {viewed ? <DoneAllIcon fontSize="small" color="disabled" /> : <NewReleasesIcon fontSize="small" color="error" />}
              <Typography variant="h6" fontWeight={700}>
                {notification.Type}
              </Typography>
              <Chip size="small" color={tone} label={viewed ? 'Viewed' : 'New'} />
            </Stack>
            <Chip size="small" variant="outlined" icon={<BookmarkIcon fontSize="small" />} label={notification.ID} />
          </Stack>

          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
            {notification.Message}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {notification.Timestamp}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
