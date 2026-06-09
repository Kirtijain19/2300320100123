import { CircularProgress, Stack, Typography } from '@mui/material';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
  );
}
