import { Error, SettingsOutlined } from '@mui/icons-material';
import {
  Alert,
  Paper,
  Container,
  Modal,
  Typography,
  AlertTitle,
  Button,
  LinearProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface ErrorProps {
  open: boolean;
  errorCode: number | string;
  errorText: string;
  closeError: (val: any) => any;
  errorTimeout: number | null;
  resetApp: boolean;
}

export default function ErrorModal({
  open,
  errorCode,
  errorText,
  closeError,
  errorTimeout,
  resetApp,
}: ErrorProps) {
  const [progress, setProgress] = useState<number>();
  // const [timerID, setTimerID] = useState<any>();

  useEffect(() => {
    if (errorTimeout && open === true) {
      setProgress(errorTimeout);
      const timer = setInterval(() => {
        setProgress((previousProgress) => {
          const prevProgress = previousProgress || 0;
          const newProgress = prevProgress - 100;
          return newProgress;
        });
      }, 100);
      setTimeout(() => {
        closeError(resetApp);
        clearInterval(timer);
      }, errorTimeout);
    }
  }, [closeError, errorTimeout, open, resetApp]);

  // useEffect(() => {}, [progress, timerID, errorTimeout, open]);

  return (
    <Modal open={open}>
      <Paper
        sx={{
          width: '50%',
          height: 400,
          textAlign: 'center',
          margin: 'auto',
          backgroundColor: 'white',
          padding: 5,
          marginTop: 6,
        }}
      >
        <Alert
          severity="error"
          onClose={() => closeError(resetApp)}
          sx={{ fontSize: 25, whiteSpace: 'pre-wrap', height: '100%' }}
          icon={<Error sx={{ fontSize: 40, marginTop: 1 }} />}
        >
          <AlertTitle sx={{ fontSize: 40 }}>Error {errorCode}</AlertTitle>
          {errorText}
        </Alert>
        {errorTimeout && (
          <LinearProgress
            variant="determinate"
            value={progress ? (progress / errorTimeout) * 100 : 100}
            sx={{ transition: 'none' }}
          />
        )}
      </Paper>
    </Modal>
  );
}
