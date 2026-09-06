import { Component, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Firestore, collection, collectionData, doc, updateDoc, getDoc} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-requests',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-requests.html',
  styleUrl: './admin-requests.css',
})
export class AdminRequests {

   selectedRequest: any = null;
   selectedResident: any = null;
  
    showModal = false;

    showRejectForm= false;
    rejectionRemarks ='';

   private firestore = inject(Firestore);

   requests$: Observable<any[]>;




   
   constructor(){
    

    const requestsRef = collection(
      this.firestore,
      'documentRequests'
    );

    this.requests$ = collectionData(
      requestsRef,
      {
        idField:'id'
      }
    );

   }





   async rejectRequest()
   {
    if(!this.selectedRequest)
    {
      return;
    }

    const remarks = this.rejectionRemarks.trim();

    if(!remarks)
    {
      return;
    }

    try
    {
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

      console.log('Request rejected. ');

      this.closeModal();
    }
    catch(error)
    {
      console.error(
        'Error rejecting requests:', error
      );
    }
   }





   cancelReject()
   {
    this.showRejectForm = false;
    this.rejectionRemarks = '';
   }
   





   
   async viewRequest(request: any)
   {

    console.log('Selected request: ', request);
    console.log('User ID: ', request.userId);

    this.selectedRequest = request;

    if(typeof request.userId !== 'string' || !request.userId.trim())
    {
      console.error('Invalid userId: ', request.userId);

      this.selectedResident = null;
      this.showModal = true;

      return;
    }
   
    try
    {
      const residentRef = doc(
        this.firestore,
        'users',
        request.userId
      );

      const residentDoc = await getDoc(
        residentRef
      );

      if (residentDoc.exists())
      {
        this.selectedResident = 
        residentDoc.data();

        console.log(
          'Resident information: ',
          this.selectedResident
        );

      }
      else 
      {
        console.log(
          'No resident document found: ',
          request.userId
        );

        this.selectedResident = null;
      }

      this.showModal = true;
     
    }
      catch (error)
      {
        console.error ('Error loading resident: ',error);

        this.selectedResident = null;
        this.showModal = true;
      }
  }





  closeModal()
  {
    this.showModal = false;

    this.selectedRequest = null;
    this.selectedResident = null;
  }





  async updatePaymentStatus(
    requestId:string,
    paymentStatus:String
  ){

    try
    {
      const requestRef = doc(
        this.firestore,
        'documentRequests',
        requestId
      );

      await updateDoc(
        requestRef,
        {
          paymentStatus: paymentStatus
        }
      );

      console.log(
        'Payment status updated: ',
        paymentStatus
      );

      this.selectedRequest = {
        ...this.selectedRequest,
        paymentStatus:paymentStatus
      };
    }
    catch(error)
    {
      console.error(
        'Error updating payment status: ',
        error
      );
    }
  }






  async updateStatus(
    requestId:string,
    status: string
  ) {

    try
    {
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
        'Request status updated: ',
        status
      );

      this.closeModal();
    }
    catch(error)
    {
      console.error(
        'Error updating request status:',
        error
      );
    }
  }
}
