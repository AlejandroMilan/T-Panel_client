import axios from "axios";

export const validateSession = async (httpUrl, token) => {
  const url = `${httpUrl}/users/validateSession`;
  return await axios
    .post(url, {}, { headers: { token } })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
