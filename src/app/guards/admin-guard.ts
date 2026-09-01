import { inject } from "@angular/core";
import { Router } from "@angular/router"; 

import { Auth, authState } from "@angular/fire/auth";

import { Firestore,doc,docData } from "@angular/fire/firestore";

import { switchMap, take, map } from "rxjs";

export const adminGuard = () => 
{

  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return authState(auth).pipe
  (

    take(1),

    switchMap(user => 
    {

      if(!user)
      {
        return [ router.createUrlTree(['/login'])];
      }

      const userRef = doc
      (

        firestore,
        'users',
        user.uid
      );

      return docData(userRef).pipe
      (

        take(1),

        map(profile => 
        {

          if(profile?.['role'] == 'admin') 
          {

            return true

          }

          return router.createUrlTree(['/dashboard'])
        })
      );
    })
  );
};