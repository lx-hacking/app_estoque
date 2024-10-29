import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [funcionarioId, setFuncionarioId] = useState(null);
  const [cargo, setCargo] = useState(null);

  const login = (id, cargo) => {
    setFuncionarioId(id);
    setCargo(cargo);
  };

  const logout = () => {
    setFuncionarioId(null);
    setCargo(null);
  };

  return (
    <AuthContext.Provider value={{ funcionarioId, cargo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
