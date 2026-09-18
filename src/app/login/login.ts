import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut
} from '@angular/fire/auth';

import { Router, RouterLink } from '@angular/router';

import {
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  email = '';
  password = '';
  message = '';


  async login() {

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!this.email || !this.password) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter your email and password.',
        confirmButtonColor: '#f57c00'
      });

      return;
    }


    // ==========================================
    // LOADING
    // ==========================================

    Swal.fire({
      title: 'Signing In',
      text: 'Please wait...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,

      didOpen: () => {
        Swal.showLoading();
      }
    });


    try {

      // ==========================================
      // KEEP USER LOGGED IN
      // ==========================================

      await setPersistence(
        this.auth,
        browserLocalPersistence
      );


      // ==========================================
      // FIREBASE LOGIN
      // ==========================================

      const credentials =
        await signInWithEmailAndPassword(
          this.auth,
          this.email,
          this.password
        );


      const uid = credentials.user.uid;


      // ==========================================
      // GET USER PROFILE
      // ==========================================

      const userDoc = await getDoc(
        doc(
          this.firestore,
          'users',
          uid
        )
      );


      // ==========================================
      // PROFILE NOT FOUND
      // ==========================================

      if (!userDoc.exists()) {

        await signOut(this.auth);

        Swal.fire({
          icon: 'error',
          title: 'Profile Not Found',
          text: 'Your user profile could not be found.',
          confirmButtonColor: '#f57c00'
        });

        return;
      }


      const userData = userDoc.data();


      // ==========================================
      // ADMIN LOGIN
      // ==========================================

      if (userData['role'] === 'admin') {

        await Swal.fire({

          icon: 'success',

          title: 'Login Successful',

          text:
            'Welcome to the MankilamEase Admin Panel.',

          confirmButtonColor: '#f57c00',

          timer: 1500,

          timerProgressBar: true,

          showConfirmButton: false

        });


        await this.router.navigate([
          '/admin-dashboard'
        ]);

      }


      // ==========================================
      // RESIDENT LOGIN
      // ==========================================

      else {

        await Swal.fire({

          icon: 'success',

          title: 'Login Successful',

          text:
            'Welcome to MankilamEase!',

          confirmButtonColor: '#f57c00',

          timer: 1500,

          timerProgressBar: true,

          showConfirmButton: false

        });


        await this.router.navigate([
          '/dashboard'
        ]);

      }

    }


    // ==========================================
    // LOGIN ERROR
    // ==========================================

    catch (error: any) {

      console.error(
        'Login error:',
        error
      );


      let errorMessage =
        'Unable to login. Please try again.';


      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {

        errorMessage =
          'Incorrect email or password.';

      }


      else if (
        error.code === 'auth/invalid-email'
      ) {

        errorMessage =
          'Please enter a valid email address.';

      }


      else if (
        error.code === 'auth/too-many-requests'
      ) {

        errorMessage =
          'Too many failed login attempts. Please try again later.';

      }


      // ==========================================
      // SHOW ERROR
      // ==========================================

      Swal.fire({

        icon: 'error',

        title: 'Login Failed',

        text: errorMessage,

        confirmButtonColor: '#f57c00'

      });

    }

  }

}