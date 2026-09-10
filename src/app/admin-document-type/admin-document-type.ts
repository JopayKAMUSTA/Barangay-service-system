import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  collectionData,
  serverTimestamp,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


interface DocumentType {
  id: string;
  name: string;
  description: string;
  fee: number;
  status: string;
}


@Component({
  selector: 'app-admin-document-type',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-document-type.html',
  styleUrl: './admin-document-type.css',
})

export class AdminDocumentType {

  editingDocumentId: string | null = null;

  private firestore = inject(Firestore);

  documentTypes$: Observable<DocumentType[]>;

  showModal = false;

  documentName = '';
  documentDescription = '';
  documentFee = 0;
  documentStatus = 'Active';


  constructor() {

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


    this.documentTypes$.subscribe({

      next: (documents) => {

        console.log(
          'Document types loaded:',
          documents
        );

      },

      error: (error) => {

        console.error(
          'Error loading document types:',
          error
        );

      }

    });

  }




  async deleteDocumentType(
    document: DocumentType
  ) {

    const result = await Swal.fire({

      icon: 'warning',

      title: 'Delete Document Type?',

      text: `Are you sure you want to delete "${document.name}"?`,

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d'

    });


    if (!result.isConfirmed) {

      return;

    }


    try {

      Swal.fire({

        title: 'Deleting...',

        text: 'Please wait.',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      const documentRef = doc(
        this.firestore,
        'documentTypes',
        document.id
      );


      await deleteDoc(documentRef);


      await Swal.fire({

        icon: 'success',

        title: 'Deleted!',

        text: 'Document Type deleted successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });

    }

    catch (error) {

      console.error(
        'Error deleting document type:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Delete Failed',

        text: 'Failed to delete document type.',

        confirmButtonColor: '#f57c00'

      });

    }

  }


 

  async updateDocumentType() {

    if (!this.editingDocumentId) {

      return;

    }


    if (!this.documentName.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Missing Document Name',

        text: 'Please enter a document name.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    if (!this.documentDescription.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Missing Description',

        text: 'Please enter a description.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    if (this.documentFee < 0) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Fee',

        text: 'Fee cannot be negative.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    try {

      Swal.fire({

        title: 'Updating Document Type',

        text: 'Please wait...',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      const documentRef = doc(
        this.firestore,
        'documentTypes',
        this.editingDocumentId
      );


      await updateDoc(
        documentRef,
        {
          name: this.documentName.trim(),

          description:
            this.documentDescription.trim(),

          fee: Number(this.documentFee),

          status: this.documentStatus
        }
      );


      await Swal.fire({

        icon: 'success',

        title: 'Updated Successfully',

        text: 'Document Type has been updated.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();

    }

    catch (error) {

      console.error(
        'Error updating document type:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Update Failed',

        text: 'Failed to update document type.',

        confirmButtonColor: '#f57c00'

      });

    }

  }




  openModal() {

    this.showModal = true;

  }


  

  editDocumentType(
    document: DocumentType
  ) {

    this.editingDocumentId = document.id;

    this.documentName = document.name;

    this.documentDescription =
      document.description;

    this.documentFee = document.fee;

    this.documentStatus = document.status;

    this.showModal = true;

  }




  closeModal() {

    this.showModal = false;

    this.editingDocumentId = null;

    this.documentName = '';

    this.documentDescription = '';

    this.documentFee = 0;

    this.documentStatus = 'Active';

  }




  async addDocumentType() {

    if (!this.documentName.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Missing Document Name',

        text: 'Please enter a document name.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    if (!this.documentDescription.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Missing Description',

        text: 'Please enter a description.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    if (this.documentFee < 0) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Fee',

        text: 'Fee cannot be negative.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    try {

      Swal.fire({

        title: 'Adding Document Type',

        text: 'Please wait...',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      const documentTypesRef = collection(
        this.firestore,
        'documentTypes'
      );


      await addDoc(
        documentTypesRef,
        {

          name:
            this.documentName.trim(),

          description:
            this.documentDescription.trim(),

          fee:
            Number(this.documentFee),

          status:
            this.documentStatus,

          createdAt:
            serverTimestamp()

        }
      );


      await Swal.fire({

        icon: 'success',

        title: 'Document Type Added',

        text: 'Document Type added successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();

    }

    catch (error) {

      console.error(
        'Error adding document type:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Add Failed',

        text: 'Failed to add document type.',

        confirmButtonColor: '#f57c00'

      });

    }

  }

}