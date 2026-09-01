import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "mankilam-barangay-system", appId: "1:1076283922485:web:be8516137f17925bca397c", storageBucket: "mankilam-barangay-system.firebasestorage.app", apiKey: "AIzaSyBvHXNpw7ESx3PyE2rNHiEHSV_4umkdxzQ", authDomain: "mankilam-barangay-system.firebaseapp.com", messagingSenderId: "1076283922485"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
