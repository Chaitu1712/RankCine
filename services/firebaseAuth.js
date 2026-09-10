import '@react-native-firebase/app';
import auth, * as authModule from '@react-native-firebase/auth';

/**
 * Safely resolves the Firebase Auth instance across modular and namespaced bindings
 */
const getAuthInstance = () => {
  if (typeof auth === 'function') {
    return auth();
  }
  if (auth && typeof auth.default === 'function') {
    return auth.default();
  }
  if (typeof authModule.getAuth === 'function') {
    return authModule.getAuth();
  }
  return null;
};

/**
 * Dispatches an SMS verification code (or triggers Firebase test number verification)
 * @param {string} phoneNumber E.164 formatted phone number (e.g. "+919876543210")
 */
export const sendPhoneOtp = async (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  const authInstance = getAuthInstance();

  if (!authInstance) {
    throw new Error(
      'Firebase Auth native module not linked. Please ensure you have rebuilt your APK with EAS after installing @react-native-firebase/auth.'
    );
  }

  // 1. Try namespaced signInWithPhoneNumber
  if (typeof authInstance.signInWithPhoneNumber === 'function') {
    return await authInstance.signInWithPhoneNumber(cleanPhone);
  }

  // 2. Try modular signInWithPhoneNumber
  if (typeof authModule.signInWithPhoneNumber === 'function') {
    return await authModule.signInWithPhoneNumber(authInstance, cleanPhone);
  }

  throw new Error('signInWithPhoneNumber method not found on Firebase Auth module.');
};

/**
 * Confirms the 6-digit OTP and extracts the signed Firebase ID Token
 * @param {any} confirmationResult
 * @param {string} otp
 */
export const confirmPhoneOtp = async (confirmationResult, otp) => {
  if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
    throw new Error('Please request an SMS verification code first.');
  }

  const userCredential = await confirmationResult.confirm(otp.trim());
  
  if (!userCredential || !userCredential.user) {
    throw new Error('Verification completed but failed to retrieve user credentials.');
  }

  const idToken = await userCredential.user.getIdToken();

  return {
    user: userCredential.user,
    idToken,
  };
};