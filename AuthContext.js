import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [funcionarioId, setFuncionarioId] = useState(null);

  const login = (id) => {
    setFuncionarioId(id);
  };

  const logout = () => {
    setFuncionarioId(null);
  };

  return (
    <AuthContext.Provider value={{ funcionarioId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
