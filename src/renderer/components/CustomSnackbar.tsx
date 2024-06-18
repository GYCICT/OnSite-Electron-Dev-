import { Alert, LinearProgress, Paper, Typography } from '@mui/material';
import { CustomContentProps, SnackbarContent } from 'notistack';
import React, { forwardRef } from 'react';

declare module 'notistack' {
  interface VariantOverrides {
    loadSnackbar: true;
  }
}

const LoadSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, message }, ref) => {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <SnackbarContent ref={ref} key={id}>
        <Paper sx={{ margin: 2, width: '100%' }}>
          <Alert severity="info">{message}</Alert>
          <LinearProgress />
        </Paper>
      </SnackbarContent>
    );
  },
);

export default LoadSnackbar;
