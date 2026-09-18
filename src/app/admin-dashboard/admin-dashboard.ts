import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Firestore,
  collection,
  getDocs
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {

  private firestore = inject(Firestore);

  requests: any[] = [];

  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;


  constructor() {

    this.loadRequests();

  }


  async loadRequests() {

    try {

      const requestsRef = collection(
        this.firestore,
        'documentRequests'
      );

      const snapshot = await getDocs(
        requestsRef
      );


      this.requests = snapshot.docs.map(
        request => ({
          id: request.id,
          ...request.data()
        })
      );


      this.totalRequests =
        this.requests.length;


      this.pendingRequests =
        this.requests.filter(
          request =>
            request.status === 'Pending'
        ).length;


      this.approvedRequests =
        this.requests.filter(
          request =>
            request.status === 'Approved'
        ).length;


      this.rejectedRequests =
        this.requests.filter(
          request =>
            request.status === 'Rejected'
        ).length;


      console.log(
        'Dashboard requests loaded:',
        this.requests
      );


    } catch (error) {

      console.error(
        'Error loading dashboard requests:',
        error
      );

    }

  }

}