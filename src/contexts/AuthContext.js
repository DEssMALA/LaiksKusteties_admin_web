import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    if (!currentUser) {
      throw "Error: AuthContext::updateEmail no currentUser";
    }
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    if (!currentUser) {
      throw "Error: AuthContext::updatePassword no currentUser";
    }
    return currentUser.updatePassword(password);
  }

  function sendInvite(email) {
    const settings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "http://localhost:3000/finish-signup",
      // This must be true.
      handleCodeInApp: true,
      //   dynamicLinkDomain: "example.page.link",
    };
    return auth.sendSignInLinkToEmail(email, settings);
  }

  function isSignInLink(link) {
    return auth.isSignInWithEmailLink(link);
  }

  function signInEmail(email, code) {
    return auth.signInWithEmailLink(email, code);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    sendInvite,
    isSignInLink,
    signInEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
