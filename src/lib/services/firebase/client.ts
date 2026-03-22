'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

import { firebaseConfig } from './config';

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

export const fbase = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

let appCheckInitialized = false;

const initAppCheck = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (appCheckInitialized || !recaptchaSiteKey) {
    return;
  }

  if (document.body && document.readyState !== 'loading') {
    initializeAppCheck(fbase, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckInitialized = true;
    return;
  }

  window.addEventListener(
    'DOMContentLoaded',
    () => {
      if (appCheckInitialized) {
        return;
      }

      try {
        initializeAppCheck(fbase, {
          provider: new ReCaptchaV3Provider(recaptchaSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
        appCheckInitialized = true;
      } catch (error) {
        console.error('Failed to initialize App Check:', error);
      }
    },
    { once: true }
  );
};

initAppCheck();
