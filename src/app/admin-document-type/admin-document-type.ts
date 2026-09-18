import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
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
  selector: 'app-admin-document-type',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-document-type.html',
  styleUrl: './admin-document-type.css',
})
export class AdminDocumentType {

  private firestore = inject(Firestore);

  documentTypes: DocumentType[] = [];

  editingDocumentId: string | null = null;

  showModal = false;

  documentName = '';
  documentDescription = '';
  documentFee = 0;
  documentStatus = 'Active';


  constructor() {
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

      const snapshot = await getDocs(documentTypesRef);

      this.documentTypes = snapshot.docs.map(document => {

        const data = document.data();

        return {
          id: document.id,
          name: data['name'] || '',
          description: data['description'] || '',
          fee: Number(data['fee'] || 0),
          status: data['status'] || 'Active'
        };

      });

      console.log(
        'Document types loaded:',
        this.documentTypes
      );

    } catch (error) {

      console.error(
        'Error loading document types:',
        error
      );

    }

  }


  // ==========================================
  // OPEN MODAL
  // ==========================================

  openModal() {

    this.editingDocumentId = null;

    this.documentName = '';
    this.documentDescription = '';
    this.documentFee = 0;
    this.documentStatus = 'Active';

    this.showModal = true;

  }


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  closeModal() {

    this.showModal = false;

    this.editingDocumentId = null;

    this.documentName = '';
    this.documentDescription = '';
    this.documentFee = 0;
    this.documentStatus = 'Active';

  }


  // ==========================================
  // ADD DOCUMENT TYPE
  // ==========================================

  async addDocumentType() {

    // Validate name
    if (!this.documentName.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Document Name Required',
        text: 'Please enter a document name.',
        confirmButtonColor: '#f57c00'
      });

      return;

    }


    // Validate description
    if (!this.documentDescription.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Description Required',
        text: 'Please enter a document description.',
        confirmButtonColor: '#f57c00'
      });

      return;

    }


    // Validate fee
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
        title: 'Adding Document Type...',
        text: 'Please wait.',
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


      await addDoc(documentTypesRef, {

        name: this.documentName.trim(),

        description: this.documentDescription.trim(),

        fee: Number(this.documentFee),

        status: this.documentStatus,

        createdAt: serverTimestamp()

      });


      // Reload list
      await this.loadDocumentTypes();


      await Swal.fire({

        icon: 'success',

        title: 'Added!',

        text: 'Document Type added successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();


    } catch (error) {

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


  // ==========================================
  // EDIT DOCUMENT TYPE
  // ==========================================

  editDocumentType(document: DocumentType) {

    this.editingDocumentId = document.id;

    this.documentName = document.name;

    this.documentDescription = document.description;

    this.documentFee = document.fee;

    this.documentStatus = document.status;

    this.showModal = true;

  }


  // ==========================================
  // UPDATE DOCUMENT TYPE
  // ==========================================

  async updateDocumentType() {

    if (!this.editingDocumentId) {
      return;
    }


    // Validate name
    if (!this.documentName.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Document Name Required',

        text: 'Please enter a document name.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    // Validate description
    if (!this.documentDescription.trim()) {

      Swal.fire({

        icon: 'warning',

        title: 'Description Required',

        text: 'Please enter a document description.',

        confirmButtonColor: '#f57c00'

      });

      return;

    }


    // Validate fee
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

        title: 'Updating...',

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

        this.editingDocumentId

      );


      await updateDoc(documentRef, {

        name: this.documentName.trim(),

        description: this.documentDescription.trim(),

        fee: Number(this.documentFee),

        status: this.documentStatus

      });


      // Reload list
      await this.loadDocumentTypes();


      await Swal.fire({

        icon: 'success',

        title: 'Updated!',

        text: 'Document Type updated successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();


    } catch (error) {

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


  // ==========================================
  // DELETE DOCUMENT TYPE
  // ==========================================

  async deleteDocumentType(document: DocumentType) {

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


      // Reload list
      await this.loadDocumentTypes();


      await Swal.fire({

        icon: 'success',

        title: 'Deleted!',

        text: 'Document Type deleted successfully.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


    } catch (error) {

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

}