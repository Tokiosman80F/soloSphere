export const googleSignIn = async (authGoogleSignIn) => {
  try {
    const userCredential = await authGoogleSignIn();
    console.log("signed in user", userCredential);
  } catch (error) {
    console.error("Google Sign-in Failed:", error);
    throw error;
  }
};
