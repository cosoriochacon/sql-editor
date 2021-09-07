import Https from "../libs/Https";

class AuthService {
  login = async (username, password) => {
    const res = await Https.post("login", { username, password });
    return res;
  };

  logout() {
    localStorage.removeItem("auth_user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("auth_user"));
  }

  isLogin = () => {
    if (localStorage.getItem("auth_user")) {
      return true;
    }

    return false;
  };
}

export default new AuthService();
