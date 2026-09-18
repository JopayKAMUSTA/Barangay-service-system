import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  authState
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';

import {
  take,
  map,
  switchMap,
  from,
  of
} from 'rxjs';

export const adminGuard = () => {

  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return authState(auth).pipe(

    take(1),

    switchMap(user => {

      // =========================
      // NOT LOGGED IN
      // =========================

      if (!user) {

        return of(
          router.createUrlTree(['/login'])
        );

      }

      // =========================
      // USER DOCUMENT
      // =========================

      const userRef = doc(
        firestore,
        'users',
        user.uid
      );

      // Use Firebase getDoc instead of docData
      return from(
        getDoc(userRef)
      ).pipe(

        map(userSnapshot => {

          // User document doesn't exist
          if (!userSnapshot.exists()) {

            return router.createUrlTree([
              '/login'
            ]);

          }

          const profile =
            userSnapshot.data();

          console.log(
            'Admin guard profile:',
            profile
          );

          // =========================
          // ADMIN
          // =========================

          if (profile['role'] === 'admin') {

            return true;

          }

          // =========================
          // NOT ADMIN
          // =========================

          return router.createUrlTree([
            '/dashboard'
          ]);

        })

      );

    })

  );

};