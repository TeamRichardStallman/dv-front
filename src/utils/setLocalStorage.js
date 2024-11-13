export const setLocalStorage = (isAuth = "true") => {
  return localStorage.setItem("isAuthenticated", isAuth);
};
