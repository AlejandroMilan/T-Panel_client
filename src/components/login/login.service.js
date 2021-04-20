import axios from "axios";

const loginAction = async (httpUrl, user) => {
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

export default loginAction;
