import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Auth, createUserWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore, doc, setDoc} from '@angular/fire/firestore';
import { CommonModule }  from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  private auth = inject(Auth);
  private firestore = inject(Firestore);


  firstname = '';
  middlename = '';
  lastname = '';
  email = '';
  password = '';
  contactNumber = '';
  birthdate = '';
  address = '';

  message = '';

  async register(){

    try{

      const userCredentials = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const uid = userCredentials.user.uid;

      await setDoc(doc(this.firestore,'users',uid),{
        firstname: this.firstname,
        middlename: this.middlename,
        lastname: this.lastname,
        email: this.email,
        contactNumber: this.contactNumber,
        birthdate: this.birthdate,
        address: this.address,
        role:'resident',
        createdAt: new Date()
      });

      this.message = 'Registration successful';


    } catch(error: any){
      console.error(error)

      this.message = error.message;
    }
  }
}
