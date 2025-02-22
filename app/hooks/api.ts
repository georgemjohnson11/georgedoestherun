import axios from 'axios';

const STRAVA_API_URL = "https://www.strava.com/api/v3";
const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
const AUTH_URL = `https://www.strava.com/oauth/token`;

export const getAccessToken = async (code: string) => {
  const response = await axios.post(AUTH_URL, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
  });
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post(AUTH_URL, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return response.data;
};

type Params = {
  [key: string]: string | number | boolean;
};


export const fetchActivities = async (accessToken: string, page: number, startDate?: Date, endDate?: Date) => {
  const params: Params = {
    page,
    per_page: 30,
  };

  if (startDate) {
    params.after = Math.floor(startDate.getTime() / 1000);
  }

  if (endDate) {
    params.before = Math.floor(endDate.getTime() / 1000);
  }

  const response = await axios.get(`${STRAVA_API_URL}/athlete/activities`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params,
  });

  return response.data;
};