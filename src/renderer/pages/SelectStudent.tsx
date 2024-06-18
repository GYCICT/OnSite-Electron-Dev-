import { useEffect, useState } from 'react';
import { Autocomplete, Container, TextField, Typography } from '@mui/material';
import { LoadStudents } from '../../api/functions';

interface selectStudentProps {
  setLoading: (val: any) => any;
  handleSelectedStudent: (val: any) => any;
  handleNextStep: () => any;
  studentData: [] | null;
}

// eslint-disable-next-line react/prop-types
function SelectStudent({
  handleSelectedStudent,
  studentData,
}: selectStudentProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  // const [studentData, setStudentData] = useState<any>(null);

  const studentDataFromDropdown = (event: any, value: any) => {
    setSelectedStudent(value);

    if (value) {
      handleSelectedStudent(value.id);
    }
  };

  return (
    <>
      <Container sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h4">Select Student</Typography>
      </Container>
      <Container sx={{ width: '50%' }}>
        <Autocomplete
          options={studentData || [{ fullName: 'No Results...' }]}
          autoHighlight
          getOptionLabel={(option: any) => option.fullName}
          renderInput={(params: any) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Student" />
          )}
          value={selectedStudent}
          onChange={(e, val) => studentDataFromDropdown(e, val)}
          disabled={studentData === null}
        />
      </Container>
    </>
  );
}

export default SelectStudent;
