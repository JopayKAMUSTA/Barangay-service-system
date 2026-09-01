import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore,collection,collectionData } from '@angular/fire/firestore';
import { Observable,map } from 'rxjs';

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports {

  private firestore = inject(Firestore);

  requests$: Observable<any[]>;

  totalRequests$: Observable<number>;
  pendingRequests$: Observable<number>;
  approvedRequests$: Observable<number>;
  rejectedRequests$: Observable<number>;

  certificateOfResidency$: Observable<number>;
  certificateOfIndigency$: Observable<number>;
  barangayClearance$: Observable<number>;

  constructor() 
  {
    const requestsRef = collection
    (
      this.firestore,
      'documentRequests'
    );

    this.requests$ = collectionData
    (
      requestsRef,
      {
        idField: 'id'
      }
    );

    this.totalRequests$ = this.requests$.pipe
    (
      map(requests => requests.length)
    );

    this.pendingRequests$ = this.requests$.pipe
    (
      map(requests => requests.filter(request => request.status === 'pending').length)

    );

    this.approvedRequests$ = this.requests$.pipe
    (
      map(requests => requests.filter(request => request.status === 'approved').length)
    );

    this.rejectedRequests$ = this.requests$.pipe
    (
      map(requests => requests.filter (request => request.status === 'rejected').length)
    );

    this.certificateOfIndigency$ = this.requests$.pipe
    (
      map(requests => requests.filter (request => request.documentType === 'Certificate of Indidency').length)
    );


    this.certificateOfResidency$ = this.requests$.pipe
    (
      map(requests => requests.filter (request => request.documentType === 'Certificate of Residency').length)
    );

    this.barangayClearance$ = this.requests$.pipe
    (
      map(requests => requests.filter (request => request.documentType === 'Barangay Clearance').length)
    );
  }

}
