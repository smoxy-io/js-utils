import {jwtDecode} from 'jwt-decode';

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (e) {
    console.error('failed to decode token:', e);
  }

  return null;
};
