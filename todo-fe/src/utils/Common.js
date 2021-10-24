const Common = {
  setToken: (token) => {
    let tokenDetails = {
      token,
      timeToExpire: Date.now() + 2 * 60 * 60 * 1000 // 2 hrs from now 
    };
    localStorage.setItem("todo_access_token", JSON.stringify(tokenDetails));
  },
  getToken: () => JSON.parse(localStorage.getItem("todo_access_token")),
  isAuthenticated: () => {
    let rememberMe =
      localStorage.getItem("rememberMe") &&
      localStorage.getItem("rememberMe") === "true"
        ? true
        : false;
    if (!rememberMe) {
      const tokenDetails = Common.getToken();
      if (!tokenDetails) {
        return false;
      }
      if (tokenDetails && tokenDetails.timeToExpire < Date.now()) {
          return false;
      }
    }
    return true;
  },
  signOut: () => localStorage.removeItem("todo_access_token"),
};

export default Common;