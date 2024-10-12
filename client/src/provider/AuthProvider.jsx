import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  // State to store the current Authenticated user
  const [user, setUser] = useState(null);

  // State to handle and display any Error encounter
  const [error, setError] = useState(null);

  // State to handle loading status (eg: during sign-in & login)
  const [loading, setLoading] = useState(true);

  /**
   * Sign-in with Google
   * */
  const authGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      setError(error.message);
      console.error("Error in Google sign in:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * create a new user with email & password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   *
   * */
  const authCreateUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      setError(error.message);
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Collecting user name and photo url
   * @param {string} name
   * @param {string} photo
   * @return {Promise<void>}
   * */
  const authUpdateProfile = async (username, photo) => {
    setLoading(true);
    setError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photo,
      });

      console.log("Profile updated successfully");

      // Return the updated user profile
      return auth.currentUser;
    } catch (error) {
      setError(error.message); // Set the error message in case of failure
      console.error("Error in Updating Profile:", error);
    } finally {
      setLoading(false); // Set loading state to false after operation completes
    }
  };

  /**
   * Sign in Existing User
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   * */
  const authSignInUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      setError(error.message);
      console.error("Error in Signin Existing user:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signout a user
   * @return {Promise<void>}
   * */
  const authSignOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      console.error("Error in SignOut :", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for change in the authenticated user's state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current User :", currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auth context value for consuming components
  const authInfo = {
    user,
    error,
    loading,
    authGoogleSignIn,
    authCreateUser,
    authSignInUser,
    authSignOutUser,
    authUpdateProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
