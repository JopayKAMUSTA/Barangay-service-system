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
  getDocs,
  addDoc,
  getDoc,
  doc
} from '@angular/fire/firestore';

import Swal from 'sweetalert2';


interface DocumentType {

  id: string;

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


  // ==========================================
  // USER
  // ==========================================

  user: User | null = null;


  // ==========================================
  // DOCUMENT TYPES
  // ==========================================

  documentTypes: DocumentType[] = [];


  // ==========================================
  // FORM
  // ==========================================

  documentType = '';

  purpose = '';

  statusMessage = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    authState(this.auth).subscribe(user => {

      this.user = user;

      console.log(
        'Auth State:',
        user
      );

    });


    this.loadDocumentTypes();

  }


  // ==========================================
  // LOAD DOCUMENT TYPES
  // ==========================================

  async loadDocumentTypes() {

    try {

      const documentTypesRef = collection(
        this.firestore,
        'documentTypes'
      );


      const snapshot =
        await getDocs(documentTypesRef);


      this.documentTypes =
        snapshot.docs.map(document => {

          const data =
            document.data();


          return {

            id: document.id,

            name:
              data['name'],

            description:
              data['description'],

            fee:
              data['fee'],

            status:
              data['status']

          };

        });


      console.log(
        'Document Types:',
        this.documentTypes
      );

    }

    catch (error) {

      console.error(
        'Error loading document types:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Unable to Load Documents',

        text:
          'The available document types could not be loaded.',

        confirmButtonColor: '#f57c00'

      });

    }

  }


  // ==========================================
  // SUBMIT REQUEST
  // ==========================================

  async submitRequest() {

    console.log(
      'Document Type:',
      this.documentType
    );


    console.log(
      'Purpose:',
      this.purpose
    );


    // ==========================================
    // VALIDATE DOCUMENT
    // ==========================================

    if (!this.documentType) {

      Swal.fire({

        icon: 'warning',

        title: 'Select a Document',

        text:
          'Please select a document before submitting your request.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    // ==========================================
    // VALIDATE PURPOSE
    // ==========================================

    if (!this.purpose.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Purpose Required',

        text:
          'Please enter the purpose of your request.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    try {

      // ==========================================
      // CHECK LOGIN
      // ==========================================

      const user =
        this.auth.currentUser;


      if (!user) {

        Swal.fire({

          icon: 'warning',

          title: 'Login Required',

          text:
            'Please log in first before submitting a request.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      // ==========================================
      // LOADING
      // ==========================================

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


      // ==========================================
      // FIND SELECTED DOCUMENT
      // ==========================================

      const selectedDocument =
        this.documentTypes.find(
          document =>
            document.id === this.documentType
        );


      if (!selectedDocument) {

        Swal.fire({

          icon: 'error',

          title: 'Document Not Found',

          text:
            'The selected document could not be found.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      // ==========================================
      // CHECK DOCUMENT STATUS
      // ==========================================

      if (
        selectedDocument.status !== 'Active'
      ) {

        Swal.fire({

          icon: 'warning',

          title: 'Document Unavailable',

          text:
            'This document is currently unavailable for requests.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      console.log(
        'Selected Document:',
        selectedDocument
      );


      // ==========================================
      // GET RESIDENT PROFILE
      // ==========================================

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

          text:
            'Your resident profile could not be found.',

          confirmButtonColor: '#f57c00'

        });

        return;

      }


      const userData =
        userDoc.data();


      // ==========================================
      // CREATE REQUEST
      // ==========================================

      await addDoc(

        collection(
          this.firestore,
          'documentRequests'
        ),

        {

          // Resident

          userId:
            user.uid,

          firstname:
            userData['firstname'],

          middlename:
            userData['middlename'],

          lastname:
            userData['lastname'],

          email:
            user.email,


          // Document

          documentTypeId:
            selectedDocument.id,

          documentType:
            selectedDocument.name,

          fee:
            selectedDocument.fee,


          // Request

          purpose:
            this.purpose.trim(),


          // Status

          status:
            'Pending',


          // Payment

          paymentStatus:
            'Unpaid',


          // Remarks

          remarks:
            '',


          // Date

          createdAt:
            new Date()

        }

      );


      // ==========================================
      // SUCCESS
      // ==========================================

      await Swal.fire({

        icon: 'success',

        title: 'Request Submitted',

        text:
          'Your document request has been submitted successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1800,

        timerProgressBar: true,

        showConfirmButton: false

      });


      // ==========================================
      // CLEAR FORM
      // ==========================================

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

        text:
          'Something went wrong while submitting your request. Please try again.',

        confirmButtonColor: '#f57c00'

      });

    }

  }

}