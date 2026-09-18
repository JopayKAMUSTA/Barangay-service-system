import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Auth, authState } from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  profile: any = null;

  loading = true;

  constructor() {

    authState(this.auth).subscribe(async user => {

      if (!user) {

        console.log('No logged-in user');

        this.profile = null;
        this.loading = false;

        return;
      }

      await this.loadProfile(user.uid);

    });

  }


  async loadProfile(userId: string) {

    this.loading = true;

    try {

      const userRef = doc(
        this.firestore,
        'users',
        userId
      );

      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {

        this.profile = {
          id: snapshot.id,
          ...snapshot.data()
        };

        console.log(
          'Profile loaded:',
          this.profile
        );

      } else {

        console.log(
          'User profile not found'
        );

        this.profile = null;

      }

    }
    catch (error) {

      console.error(
        'Error loading profile:',
        error
      );

      this.profile = null;

    }

    this.loading = false;

  }

}