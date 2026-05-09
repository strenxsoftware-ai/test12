'use client';

import { GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';
import { doc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function signInWithGoogle(auth: Auth, db: Firestore) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sync user data to Firestore
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    };

    // Non-blocking sync per guidelines
    setDoc(userRef, userData, { merge: true })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData
        }));
      });

    return user;
  } catch (error) {
    // Errors are generally handled by the caller or emitted centrally
    throw error;
  }
}
