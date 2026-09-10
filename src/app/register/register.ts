import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc
} from '@angular/fire/firestore';

import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);


  firstname = '';
  middlename = '';
  lastname = '';
  email = '';
  password = '';
  contactNumber = '';
  birthdate = '';
  address = '';

  message = '';


  async register() {


    if (
      !this.firstname ||
      !this.lastname ||
      !this.email ||
      !this.password ||
      !this.contactNumber ||
      !this.birthdate ||
      !this.address
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please complete all required fields.',
        confirmButtonColor: '#f57c00'
      });

      return;
    }




    Swal.fire({
      title: 'Creating Account',
      text: 'Please wait...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,

      didOpen: () => {
        Swal.showLoading();
      }
    });


    try {

   

      const userCredentials =
        await createUserWithEmailAndPassword(
          this.auth,
          this.email,
          this.password
        );


      const uid = userCredentials.user.uid;



      await setDoc(
        doc(this.firestore, 'users', uid),
        {
          firstname: this.firstname,
          middlename: this.middlename,
          lastname: this.lastname,
          email: this.email,
          contactNumber: this.contactNumber,
          birthdate: this.birthdate,
          address: this.address,
          role: 'resident',
          createdAt: new Date()
        }
      );



      await Swal.fire({

        icon: 'success',

        title: 'Registration Successful',

        text: 'Your MankilamEase account has been created successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1800,

        timerProgressBar: true,

        showConfirmButton: false

      });



      await this.router.navigate([
        '/login'
      ]);


    } catch (error: any) {

      console.error(
        'Registration error:',
        error
      );



      let errorMessage =
        'Unable to create your account. Please try again.';


      if (
        error.code === 'auth/email-already-in-use'
      ) {

        errorMessage =
          'This email address is already registered.';

      }


      else if (
        error.code === 'auth/invalid-email'
      ) {

        errorMessage =
          'Please enter a valid email address.';

      }


      else if (
        error.code === 'auth/weak-password'
      ) {

        errorMessage =
          'Your password is too weak. Please choose a stronger password.';

      }


   

      Swal.fire({

        icon: 'error',

        title: 'Registration Failed',

        text: errorMessage,

        confirmButtonColor: '#f57c00'

      });

    }

  }

}