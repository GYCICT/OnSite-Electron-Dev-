import axios, { AxiosError } from 'axios';
import { LoadStudents } from './functions';
import heartBeat from './heartbeat';

export async function validateCookie() {
  try {
    const sessionID = localStorage.getItem('sessionID');

    if (!sessionID) {
      return true;
    }

    const response = await axios.post(
      'https://onsitedev.gyc.tas.edu.au/i.php',
      { session_id: sessionID },
    );

    console.log(response);

    if (response.data === 'undefined') {
      localStorage.removeItem('sessionID');
      return true;
    }
    localStorage.setItem('sessionID', sessionID);
    return false;
    // Disable reload
  } catch (error: AxiosError | any) {
    // console.log(error);
    // localStorage.removeItem('sessionID');
    // Show Login if it fails
    localStorage.removeItem('sessionID');
    return true;
  }
}

export async function auth(key: string) {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 2);

  try {
    const response = await axios.get(
      'https://onsitedev.gyc.tas.edu.au/api/2.0/auth.php',
      {
        headers: { 'API-Key': key },
      },
    );

    if (response.data.SessionID) {
      localStorage.setItem('sessionID', response.data.SessionID);
      heartBeat();
      LoadStudents(response.data.SessionID);
      return false;
    }

    return true;
  } catch (error: AxiosError | any) {
    console.log(error);
    // Show Error Modal then hide
    return true;
  }
}
