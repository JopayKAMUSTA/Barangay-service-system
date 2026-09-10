import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  getDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-requests',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-requests.html',
  styleUrl: './admin-requests.css',
})

export class AdminRequests {

  selectedRequest: any = null;
  selectedResident: any = null;

  showModal = false;

  showRejectForm = false;
  rejectionRemarks = '';

  private firestore = inject(Firestore);

  requests$: Observable<any[]>;


  constructor() {

    const requestsRef = collection(
      this.firestore,
      'documentRequests'
    );

    this.requests$ = collectionData(
      requestsRef,
      {
        idField: 'id'
      }
    );

  }



  async rejectRequest() {

    if (!this.selectedRequest) {
      return;
    }


    const remarks =
      this.rejectionRemarks.trim();


    if (!remarks) {

      Swal.fire({
        icon: 'warning',
        title: 'Remarks Required',
        text: 'Please provide a reason for rejecting this request.',
        confirmButtonColor: '#f57c00'
      });

      return;
    }


    try {

      Swal.fire({
        title: 'Rejecting Request',
        text: 'Please wait...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,

        didOpen: () => {
          Swal.showLoading();
        }
      });


      const requestRef = doc(
        this.firestore,
        'documentRequests',
        this.selectedRequest.id
      );


      await updateDoc(
        requestRef,
        {
          status: 'Rejected',
          remarks: remarks
        }
      );


      await Swal.fire({

        icon: 'success',

        title: 'Request Rejected',

        text: 'The document request has been rejected.',

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();

    }

    catch (error) {

      console.error(
        'Error rejecting request:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Rejection Failed',

        text: 'Unable to reject the request. Please try again.',

        confirmButtonColor: '#f57c00'

      });

    }

  }


  

  cancelReject() {

    this.showRejectForm = false;

    this.rejectionRemarks = '';

  }


  

  async viewRequest(request: any) {

    console.log(
      'Selected request:',
      request
    );

    console.log(
      'User ID:',
      request.userId
    );


    this.selectedRequest = request;


    if (
      typeof request.userId !== 'string' ||
      !request.userId.trim()
    ) {

      console.error(
        'Invalid userId:',
        request.userId
      );

      this.selectedResident = null;

      this.showModal = true;

      return;

    }


    try {

      const residentRef = doc(
        this.firestore,
        'users',
        request.userId
      );


      const residentDoc =
        await getDoc(residentRef);


      if (residentDoc.exists()) {

        this.selectedResident =
          residentDoc.data();


        console.log(
          'Resident information:',
          this.selectedResident
        );

      }

      else {

        console.log(
          'No resident document found:',
          request.userId
        );

        this.selectedResident = null;

      }


      this.showModal = true;

    }

    catch (error) {

      console.error(
        'Error loading resident:',
        error
      );

      this.selectedResident = null;

      this.showModal = true;

    }

  }


  

  closeModal() {

    this.showModal = false;

    this.selectedRequest = null;

    this.selectedResident = null;

    this.showRejectForm = false;

    this.rejectionRemarks = '';

  }


 

  async updatePaymentStatus(
    requestId: string,
    paymentStatus: string
  ) {

    try {

      Swal.fire({

        title: 'Updating Payment',

        text: 'Please wait...',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      const requestRef = doc(
        this.firestore,
        'documentRequests',
        requestId
      );


      const paidAt = new Date();


      await updateDoc(
        requestRef,
        {
          paymentStatus: paymentStatus,
          paidAt: paidAt
        }
      );


      console.log(
        'Payment status updated:',
        paymentStatus
      );


      this.selectedRequest = {

        ...this.selectedRequest,

        paymentStatus:
          paymentStatus,

        paidAt:
          paidAt

      };


      await Swal.fire({

        icon: 'success',

        title: 'Payment Updated',

        text: `Payment status has been marked as ${paymentStatus}.`,

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });

    }

    catch (error) {

      console.error(
        'Error updating payment status:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Payment Update Failed',

        text: 'Unable to update the payment status.',

        confirmButtonColor: '#f57c00'

      });

    }

  }


  

  async updateStatus(
    requestId: string,
    status: string
  ) {

    try {

      Swal.fire({

        title: 'Updating Request',

        text: 'Please wait...',

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

          Swal.showLoading();

        }

      });


      const requestRef = doc(
        this.firestore,
        'documentRequests',
        requestId
      );


      await updateDoc(
        requestRef,
        {
          status: status
        }
      );


      console.log(
        'Request status updated:',
        status
      );


      await Swal.fire({

        icon: 'success',

        title: 'Status Updated',

        text: `Request status changed to ${status}.`,

        confirmButtonColor: '#f57c00',

        timer: 1500,

        timerProgressBar: true,

        showConfirmButton: false

      });


      this.closeModal();

    }

    catch (error) {

      console.error(
        'Error updating request status:',
        error
      );


      Swal.fire({

        icon: 'error',

        title: 'Update Failed',

        text: 'Unable to update the request status.',

        confirmButtonColor: '#f57c00'

      });

    }

  }

}