import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-document-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-request.html',
  styleUrl: './document-request.css',
})
export class DocumentRequest {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user:User | null = null

  documentType = '';
  purpose = '';
  statusMessage = '';


  constructor(){

    authState(this.auth).subscribe(user => {

      this.user = user;

      console.log('Auth State: ', user);
    });
  }
  async submitRequest(){
    console.log('Document Type: ', this.documentType);
    console.log('Purpose : ', this.purpose);


    try {

      const user = this.auth.currentUser;

      if(!user){
       this.statusMessage = 'Please Log in First,'
        return;
      }

      console.log('logged in user', user);

      await addDoc (
        collection(this.firestore, 'documentRequests'),
        {
          userId: user.uid,
          email: user.email,
          documentType: this.documentType,
          purpose: this.purpose,
          status: 'pending',
          createdAt: new Date()

        }
      );
      
      this.statusMessage = 'Document request submitted successfully';

      this.documentType = '';
      this.purpose = '';

    }
    catch (error:any){
      console.error(error);

      this.statusMessage = error.message;
    }
  }

}
