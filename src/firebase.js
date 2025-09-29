// Mock Firebase for now to test if the app renders
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    console.log('Mock Firebase: onAuthStateChanged called');
    callback(null); // No user logged in
    return () => {}; // cleanup function
  },
  signInWithEmailAndPassword: async () => {
    throw new Error('Mock Firebase not implemented');
  },
  createUserWithEmailAndPassword: async () => {
    throw new Error('Mock Firebase not implemented');
  },
  signInWithPopup: async () => {
    throw new Error('Mock Firebase not implemented');
  },
  signOut: async () => {
    console.log('Mock Firebase: signOut called');
  }
};

export default {};
