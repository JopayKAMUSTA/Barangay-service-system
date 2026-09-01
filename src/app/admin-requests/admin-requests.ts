import { Component, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Firestore, collection, collectionData, doc, updateDoc, getDoc} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-requests',
  imports: [CommonModule],
  templateUrl: './admin-requests.html',
  styleUrl: './admin-requests.css',
})
export class AdminRequests {

   selectedRequest: any = null;
   selectedResident: any = null;
  
    showModal = false;

   private firestore = inject(Firestore);
   private injector = inject(EnvironmentInjector);

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

      const residentDoc = await runInInjectionContext(
        this.injector,
        () => 
        {
          const residentRef = doc
          (
            this.firestore,
            'users',
            request.userId
          );
          return getDoc(residentRef);
        }
      );

      if(residentDoc.exists())
      {
        this.selectedResident = residentDoc.data();

        console.log
        (
          'Resident information: ',
          this.selectedResident
        );
      }
      else
      {
        console.log
        (
          'No resident document found: ',
          request.userId
        );
        this.selectedResident = null;
      }

      this.showModal = true;

    }
    catch (error)
    {
      console.error (error);
    }

  }

  closeModal()
  {
    this.showModal = false;

    this.selectedRequest = null;
    this.selectedResident = null;

  }

  async updateStatus( requestId: string, status: string)
  {
    try
    {
      const requestRef = doc (
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

      this.closeModal();
    }
      catch (error)
      {
        console.error (error);
      }
  }
}
