import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  private firestore = inject(Firestore);

  requests$: Observable<any[]>;

  totalRequests$:Observable<number>;
  pendingRequests$: Observable<number>;
  approvedRequests$: Observable<number>;
  rejectedRequests$: Observable<number>;
  
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

    this.totalRequests$ = this.requests$.pipe(
      map(requests => requests.length)
    );

    this.pendingRequests$ = this.requests$.pipe(
      map(requests => requests.filter(requests => requests.status === 'pending').length)
    );

    this.approvedRequests$ = this.requests$.pipe(
      map(requests => requests.filter(requests => requests.status === 'approved').length)
    );

    this.rejectedRequests$ = this.requests$.pipe(
      map(requests => requests.filter(requests => requests.status === 'rejected').length)
    );
  }
}
