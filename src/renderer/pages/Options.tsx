import { BackdropProps, Button, Container, Modal, Slide } from '@mui/material';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Late, SignIn, SignOut } from '../../api/functions';

interface optionProps {
  options: string[];
  StudentID: string;
  handleReset: () => void;
}

const reasons = [
  {
    type: 'Sign Out',
    ReasonID: 19,
    Description: 'Appointment ',
    DefaultTimeBlocks: 2,
  },
  {
    type: 'Sign Out',
    ReasonID: 1,
    Description: 'Illness ',
    DefaultTimeBlocks: -1,
  },
  {
    type: 'Sign Out',
    ReasonID: 43,
    Description: 'Unverified Absence ',
    DefaultTimeBlocks: -1,
  },
  {
    type: 'Sign Out',
    ReasonID: 44,
    Description: 'Moving car (10 minutes only) ',
    DefaultTimeBlocks: -1,
  },

  {
    type: 'Late',
    ReasonID: 20,
    Description: 'Other',
  },
  {
    type: 'Late',
    ReasonID: 21,
    Description: 'Personal / Family Issue',
  },
  {
    type: 'Late',
    ReasonID: 22,
    Description: 'Slept in',
  },
  {
    type: 'Late',
    ReasonID: 23,
    Description: 'Transport Issues',
  },
  {
    type: 'Late',
    ReasonID: 19,
    Description: 'Appointment',
  },
];

// eslint-disable-next-line react/prop-types
export default function Options({
  options,
  StudentID,
  handleReset,
}: optionProps) {
  const buttonOptions = options || [''];
  const [reasonOptions, setReasonOptions] = useState<any>();

  const handleGoodSubmission = () => {
    Swal.fire({
      title: 'Success!',
      text: 'User entry recorded into SIMON.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      didDestroy: () => handleReset(),
    });
  };

  const handleBadSubmission = () => {
    Swal.fire({
      title: 'Error',
      text: 'User entry failed to be recorded into SIMON. Please see office staff.',
      icon: 'error',
      timer: 10000,
      showConfirmButton: false,
      didDestroy: () => handleReset(),
    });
  };

  const handleReasonOption = async (
    ReasonID?: string,
    Type?: string,
    ReasonText?: string,
  ) => {
    // console.log(
    //   `${StudentID} ${ReasonID} ${Type} ${localStorage.getItem('SiteID')}`,
    // );
    if (Type === 'Late') {
      const response = await Late({
        StudentID,
        ReasonID,
      });
      if (response.status === 200) {
        handleGoodSubmission();
      } else {
        handleBadSubmission();
      }
    } else if (Type === 'Sign Out') {
      const response = await SignOut({ StudentID, ReasonID, ReasonText });
      if (response.status === 200) {
        handleGoodSubmission();
      } else {
        handleBadSubmission();
      }
    }
  };

  const handleSignIn = async () => {
    const response = await SignIn({ StudentID });
    // console.log(response);
    if (response.status === 200) {
      handleGoodSubmission();
    } else {
      handleBadSubmission();
    }
  };

  // eslint-disable-next-line consistent-return
  const getMoreOptions = (key: any) => {
    if (key === 'Sign In') {
      handleSignIn();
    } else {
      const filterReasons = reasons.filter((option) => option.type === key);
      const moreButtons = filterReasons.sort((a, b) =>
        a.Description.localeCompare(b.Description),
      );
      // console.log(moreButtons);
      setReasonOptions(moreButtons);
    }
  };

  return (
    <>
      <Container
        sx={{
          padding: 3,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        {options &&
          !reasonOptions &&
          buttonOptions.map((option: any) => (
            <Slide in direction="up" key={option}>
              <Button
                variant="contained"
                sx={{
                  textAlign: 'center',
                  fontSize: 24,
                  margin: 4,
                }}
                onClick={() => getMoreOptions(option)}
              >
                {option}
              </Button>
            </Slide>
          ))}
      </Container>
      <Container>
        {reasonOptions &&
          reasonOptions.map((option: any) => (
            <Slide in direction="up" key={option.Description}>
              <Button
                variant="contained"
                sx={{
                  textAlign: 'center',
                  fontSize: 24,
                  margin: 4,
                }}
                onClick={() =>
                  handleReasonOption(
                    option.ReasonID,
                    option.type,
                    option.Description,
                  )
                }
              >
                {option.Description}
              </Button>
            </Slide>
          ))}
      </Container>
    </>
  );
}
