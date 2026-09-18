import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  getDocs
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports {

  private firestore = inject(Firestore);

  requests: any[] = [];

  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;

  documentBreakdown: {
    name: string;
    count: number;
  }[] = [];

  constructor() {
    this.loadReports();
  }

  async loadReports() {

    try {

      const requestsRef = collection(
        this.firestore,
        'documentRequests'
      );

      const snapshot = await getDocs(requestsRef);

      this.requests = snapshot.docs.map(request => ({
        id: request.id,
        ...request.data()
      }));

      // Total
      this.totalRequests = this.requests.length;

      // Pending
      this.pendingRequests = this.requests.filter(
        request => request.status === 'Pending'
      ).length;

      // Approved
      this.approvedRequests = this.requests.filter(
        request => request.status === 'Approved'
      ).length;

      // Rejected
      this.rejectedRequests = this.requests.filter(
        request => request.status === 'Rejected'
      ).length;


      // Document breakdown
      const counts: {
        [key: string]: number;
      } = {};

      this.requests.forEach(request => {

        const documentName = request.documentType;

        if (documentName) {

          if (!counts[documentName]) {
            counts[documentName] = 0;
          }

          counts[documentName]++;
        }

      });

      this.documentBreakdown = Object.keys(counts).map(name => ({
        name: name,
        count: counts[name]
      }));


      console.log('Reports loaded:', this.requests);
      console.log('Document breakdown:', this.documentBreakdown);

    } catch (error) {

      console.error(
        'Error loading reports:',
        error
      );

    }

  }
}