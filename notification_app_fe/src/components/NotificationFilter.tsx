import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';

interface NotificationFilterProps {
  type: string;
  onTypeChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

export function NotificationFilter({ type, onTypeChange, limit, onLimitChange }: NotificationFilterProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="notification-type-label">Notification Type</InputLabel>
        <Select
          labelId="notification-type-label"
          label="Notification Type"
          value={type}
          onChange={(event) => onTypeChange(String(event.target.value))}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="notification-limit-label">Page Size</InputLabel>
        <Select
          labelId="notification-limit-label"
          label="Page Size"
          value={String(limit)}
          onChange={(event) => onLimitChange(Number(event.target.value))}
        >
          <MenuItem value="8">8</MenuItem>
          <MenuItem value="12">12</MenuItem>
          <MenuItem value="20">20</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
