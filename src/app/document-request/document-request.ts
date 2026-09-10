import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Auth,
  authState,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  getDoc,
  doc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';


interface DocumentType {

  id: string;

  userId: string;

  name: string;

  description: string;

  fee: number;

  status: string;

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


  user: User | null = null;


  documentType = '';

  purpose = '';

  statusMessage = '';


  constructor() {

    authState(this.auth).subscribe(user => {

      this.user = user;

      console.log(
        'Auth State:',
        user
      );

    });


    const documentTypesRef = collection(
      this.firestore,
      'documentTypes'
    );


    this.documentTypes$ = collectionData(
      documentTypesRef,
      {
        idField: 'id'
      }
    ) as Observable<DocumentType[]>;

  }


  

  async submitRequest() {

    console.log(
      'Document Type:',
      this.documentType
    );

    console.log(
      'Purpose:',
      this.purpose
    );


    if (!this.documentType) {

      Swal.fire({

        icon: 'warning',

        title: 'Select a Document',

        text: 'Please select a document before submitting your request.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    if (!this.purpose.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Purpose Required',

        text: 'Please enter the purpose of your request.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    try {


      const user = this.auth.currentUser;


      if (!user) {

        Swal.fire({

          icon: 'warning',

          title: 'Login Required',

          text: 'Please log in first before submitting a request.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      Swal.fire({

        title: 'Submitting Request',

        text: 'Please wait...',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });




      const documents =
        await new Promise<DocumentType[]>(
          (resolve) => {

            this.documentTypes$.subscribe({

              next: documents => {

                resolve(documents);

              }

            });

          }
        );


    

      const selectedDocument =
        documents.find(
          document =>
            document.id === this.documentType
        );


      if (!selectedDocument) {

        Swal.fire({

          icon: 'error',

          title: 'Document Not Found',

          text: 'The selected document could not be found.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


 

      if (
        selectedDocument.status !== 'Active'
      ) {

        Swal.fire({

          icon: 'warning',

          title: 'Document Unavailable',

          text: 'This document is currently unavailable for requests.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      console.log(
        'Selected Document:',
        selectedDocument
      );


      const userDocRef = doc(
        this.firestore,
        'users',
        user.uid
      );


      const userDoc =
        await getDoc(userDocRef);


      if (!userDoc.exists()) {

        Swal.fire({

          icon: 'error',

          title: 'Profile Not Found',

          text: 'Your resident profile could not be found.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      const userData =
        userDoc.data();



      await addDoc(

        collection(
          this.firestore,
          'documentRequests'
        ),

        {

          userId: user.uid,

          firstname:
            userData['firstname'],

          middlename:
            userData['middlename'],

          lastname:
            userData['lastname'],

          email:
            user.email,


          documentTypeId:
            selectedDocument.id,

          documentType:
            selectedDocument.name,

          fee:
            selectedDocument.fee,


          purpose:
            this.purpose.trim(),


          status:
            'Pending',


          paymentStatus:
            'Unpaid',


          remarks:
            '',


          createdAt:
            new Date()

        }

      );



      await Swal.fire({

        icon: 'success',

        title: 'Request Submitted',

        text: 'Your document request has been submitted successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1800,

        timerProgressBar: true,

        showConfirmButton: false

      });


    

      this.documentType = '';

      this.purpose = '';

    }


    catch (error) {

      console.error(
        'Error submitting request:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Request Failed',

        text: 'Something went wrong while submitting your request. Please try again.',

        confirmButtonColor: '#f57c00'

      });

    }

  }

}