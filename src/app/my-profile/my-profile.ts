import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Auth, authState } from '@angular/fire/auth';

import { Firestore,doc,docData } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  profile$: Observable<any> = of(null);

  constructor() {

    authState(this.auth).subscribe(users => {

      if(!users) {
        console.log('No logged-in user');
        this.profile$ = of(null);
        return;
      }

      const userRef = doc(
        this.firestore,
        'users',
        users.uid
      );

      this.profile$ = docData(userRef);
    });
  }
}
