import { Box, Button, Stack, Typography } from '@mui/material';

interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, hasNextPage, onPageChange }: PaginationProps) {
  const hasPrev = page > 1;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mt: 3 }}>
      <Button variant="outlined" disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Page {page}
        </Typography>
      </Box>
      <Button variant="outlined" disabled={!hasNextPage} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </Stack>
  );
}
