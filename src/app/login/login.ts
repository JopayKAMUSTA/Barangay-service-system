import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword
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

  

    if (!this.email || !this.password) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter your email and password.',
        confirmButtonColor: '#f57c00'
      });

      return;
    }



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


      const credentials = await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );


      const uid = credentials.user.uid;


  

      const userDoc = await getDoc(
        doc(this.firestore, 'users', uid)
      );


     

      if (!userDoc.exists()) {

        Swal.fire({
          icon: 'error',
          title: 'Profile Not Found',
          text: 'Your user profile could not be found.',
          confirmButtonColor: '#f57c00'
        });

        return;
      }


      const userData = userDoc.data();


   

      if (userData['role'] === 'admin') {

        await Swal.fire({

          icon: 'success',

          title: 'Login Successful',

          text: 'Welcome to the MankilamEase Admin Panel.',

          confirmButtonColor: '#f57c00',

          timer: 1500,

          timerProgressBar: true,

          showConfirmButton: false

        });


        await this.router.navigate([
          '/admin-dashboard'
        ]);

      }


   

      else {

        await Swal.fire({

          icon: 'success',

          title: 'Login Successful',

          text: 'Welcome to MankilamEase!',

          confirmButtonColor: '#f57c00',

          timer: 1500,

          timerProgressBar: true,

          showConfirmButton: false

        });


        await this.router.navigate([
          '/dashboard'
        ]);

      }


    } catch (error: any) {

      console.error('Login error:', error);


 

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




      Swal.fire({

        icon: 'error',

        title: 'Login Failed',

        text: errorMessage,

        confirmButtonColor: '#f57c00'

      });

    }

  }

}