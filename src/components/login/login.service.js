import axios from "axios";

export const loginAction = async (httpUrl, user) => {
  const url = `${httpUrl}/users/login/`;
  return await axios
    .post(url, user)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });
};

export const signupAction = async (httpUrl, user, sessionToken) => {
  const url = `${httpUrl}/users/signup/`;
  return await axios
    .post(url, user, { headers: { token: sessionToken } })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
