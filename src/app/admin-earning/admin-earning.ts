import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  collection,
  getDocs
} from '@angular/fire/firestore';


interface DocumentRequest {

  id: string;

  firstname: string;
  middlename: string;
  lastname: string;
  email: string;

  documentType: string;
  fee: number;

  status: string;
  paymentStatus: string;

  createdAt: any;
  paidAt: any;
}


@Component({
  selector: 'app-admin-earning',
  imports: [CommonModule],
  templateUrl: './admin-earning.html',
  styleUrl: './admin-earning.css',
})
export class AdminEarning {

  private firestore = inject(Firestore);

  requests: DocumentRequest[] = [];


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
        } as DocumentRequest)
      );


      console.log(
        'Earning requests loaded:',
        this.requests
      );

    } catch (error) {

      console.error(
        'Error loading earning requests:',
        error
      );

    }

  }


  getPaidRequests(
    requests: DocumentRequest[]
  ): DocumentRequest[] {

    return requests.filter(
      request =>
        request.paymentStatus === 'Paid'
    );

  }


  getTotalEarnings(
    requests: DocumentRequest[]
  ): number {

    return this.getPaidRequests(
      requests
    ).reduce(
      (total, request) =>
        total + Number(request.fee || 0),
      0
    );

  }


  getPaidCount(
    requests: DocumentRequest[]
  ): number {

    return this.getPaidRequests(
      requests
    ).length;

  }


  getPendingPayment(
    requests: DocumentRequest[]
  ): number {

    return requests
      .filter(
        request =>
          request.paymentStatus !== 'Paid'
      )
      .reduce(
        (total, request) =>
          total + Number(request.fee || 0),
        0
      );

  }

}