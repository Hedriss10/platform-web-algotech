import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Novo estado de carregamento

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false); // Finaliza o carregamento após verificar o localStorage
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("access_token", accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("access_token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
