import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, getDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface DocumentType 
{
  id:string;
  userId:string;
  name:string;
  description:string;
  fee:number;
  status:string;
}


@Component({
  selector: 'app-document-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-request.html',
  styleUrl: './document-request.css',
})
export class DocumentRequest {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  documentTypes$: Observable<DocumentType[]>;

  user:User | null = null

  documentType = '';
  purpose = '';
  statusMessage = '';


  constructor(){

    authState(this.auth).subscribe(user => {

      this.user = user;

      console.log('Auth State: ', user);
    });

    const documentTypesRef = collection(
      this.firestore,
      'documentTypes'
    );

    this.documentTypes$ = collectionData(
      documentTypesRef,
      {
        idField:'id'
      }
    ) as Observable<DocumentType[]>
  }
  async submitRequest(){
    console.log('Document Type: ', this.documentType);
    console.log('Purpose : ', this.purpose);

    if(!this.documentType)
    {
      this.statusMessage = 'Please select a document.';
      return;
    }

    if(!this.purpose.trim())
    {
      this.statusMessage = 'Please enter the purpose of your request.';
      return; 
    }


    try {

      const user = this.auth.currentUser;

      if(!user){
       this.statusMessage = 'Please Log in First,'
        return;
      }

      // Get Document Types loaded from firebase
      const documents = await new Promise<DocumentType[]>((resolve) =>
      {
        this.documentTypes$.subscribe({
          next: documents => resolve(documents)
        });
      });

      const selectedDocument = documents.find(
        document => document.id === this.documentType
      );

      if(!selectedDocument)
      {
        this.statusMessage = 'Selected document could not be found.';
        return;
      }

      console.log('Selected Document: ', selectedDocument);

      const userDocRef = doc(
        this.firestore,
        'users',
        user.uid
      );

      const userDoc = await getDoc(userDocRef);

      if(!userDoc.exists()){
        this.statusMessage = 'Resident profile could not be found.';
        return;
      }

      const userData = userDoc.data();

      await addDoc(
        collection(this.firestore,'documentRequests'),
        {
          userId: user.uid,

          firstname: userData['firstname'],
          middlename: userData['middlename'],
          lastname: userData['lastname'],
          email: user.email,

          documentTypeId: selectedDocument.id,
          documentType: selectedDocument.name,
          fee: selectedDocument.fee,

          purpose: this.purpose.trim(),

          status:'Pending',

          paymentStatus:'Unpaid',

          remarks:'',

          createdAt: new Date()
        }
      );

      this.statusMessage =
      'Document request submitted successfully:';

      this.documentType= '';
      this.purpose = '';
      
    }
    catch(error)
    {
      console.error('Error submitting request: ', error);
    }

  }
}
