import axios, { AxiosError } from 'axios';

export async function CheckConnectivity() {
  try {
    const response = await axios.get('https://onsitedev.gyc.tas.edu.au/');
    return response;
  } catch (error: AxiosError | any) {
    return error;
  }
}

export async function LoadStudents(session?: string) {
  try {
    const students = await axios.get(
      'https://onsitedev.gyc.tas.edu.au/api/2.0/studentsearch?search=',
      {
        headers: {
          session_id: session || localStorage.getItem('sessionID'),
        },
      },
    );
    const studentsArr: [] = students.data;

    const response = studentsArr.map(
      (item: any) => {
        return {
          fullName: item.Given2
            ? `${item.Given1} ${item.Given2} ${item.Surname}`
            : `${item.Given1} ${item.Surname}`,
          id: item.ID,
        };
      },
      [...studentsArr],
    );

    return response;
  } catch (error: AxiosError | any) {
    return null;
  }
}

interface studentData {
  StudentName?: string;
  StudentID?: string;
  ReasonID?: string;
}

export async function Late(data: studentData) {
  const studentID = data.StudentID;
  const reasonID = data.ReasonID;

  try {
    const response = axios.get(
      `https://onsitedev.gyc.tas.edu.au/api/2.0/studentLate?id=${studentID}&reason=${reasonID}`,
      {
        headers: {
          session_id: localStorage.getItem('sessionID'),
        },
      },
    );
    return response;

    // Show student logged in ${studentName}
  } catch (error: AxiosError | any) {
    // Show error then reset
    return error;
  }
}

export async function SignIn(data: studentData) {
  const studentID = data.StudentID;

  try {
    const response = axios.get(
      `https://onsitedev.gyc.tas.edu.au/api/2.0/studentsignin?id=${studentID}`,
      {
        headers: {
          session_id: localStorage.getItem('sessionID'),
        },
      },
    );
    return response;
  } catch (error: AxiosError | any) {
    return error;
  }
}

interface signOutData {
  StudentID?: string;
  ReasonID?: string;
  ReasonText?: string;
}

export async function SignOut(data: signOutData) {
  const SiteID = localStorage.getItem('SiteID');
  const { StudentID } = data;
  const { ReasonID } = data;
  const { ReasonText } = data;

  try {
    const response = axios.get(
      `https://onsitedev.gyc.tas.edu.au/api/2.0/studentsignout?id=${StudentID}&reason=${ReasonID}&reasontext=${ReasonText}&siteid=${SiteID}`,
      {
        headers: {
          session_id: localStorage.getItem('sessionID'),
        },
      },
    );
    return response;
  } catch (error: AxiosError | any) {
    return error;
  }
}

export async function GetStudentActions(id: any) {
  try {
    const response = await axios.get(
      `https://onsitedev.gyc.tas.edu.au/api/2.0/studentactions?id=${id}`,
      { headers: { session_id: localStorage.getItem('sessionID') } },
    );

    if (response.data.length > 0) {
      return response;
    }
  } catch (error: AxiosError | any) {
    return error;
  }
}
