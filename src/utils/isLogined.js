export const isLogined = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };
  