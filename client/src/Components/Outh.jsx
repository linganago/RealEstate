import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleClick = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ include cookies
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        console.error(data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.log('Google OAuth error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      disabled={isSigningIn}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isSigningIn ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
