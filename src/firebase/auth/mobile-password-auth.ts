
'use client';

import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Maps a mobile number to a pseudo-email for Firebase Auth.
 * Format: [number]@viloryi.app
 */
const getPseudoEmail = (mobile: string) => `${mobile}@viloryi.app`;

export async function signUpWithMobile(auth: Auth, db: Firestore, mobile: string, password: string, name: string) {
  const email = getPseudoEmail(mobile);
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Set display name in Auth
    await updateProfile(user, { displayName: name });

    // Sync user data to Firestore
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      uid: user.uid,
      mobile: mobile,
      displayName: name,
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, userData, { merge: true });
    
    return user;
  } catch (error) {
    throw error;
  }
}

export async function loginWithMobile(auth: Auth, mobile: string, password: string) {
  const email = getPseudoEmail(mobile);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw error;
  }
}
