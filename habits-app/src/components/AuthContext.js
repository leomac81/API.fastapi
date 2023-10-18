import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // You might want to use something like JWTs or some other mechanism to keep the user logged in even after a page refresh
  
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
