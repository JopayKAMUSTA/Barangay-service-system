import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';

interface DocumentRequest {
  id: string;
  userId: string;
  email: string;
  documentType: string;
  documentTypeId: string;
  purpose: string;
  fee: number;
  status: string;
  paymentStatus?: string;
  remarks: string;
  createdAt: any;
}

@Component({
  selector: 'app-my-request',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-request.html',
  styleUrl: './my-request.css',
})
export class MyRequest {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  requests: DocumentRequest[] = [];

  loading = true;

  constructor() {

    authState(this.auth).subscribe(async user => {

      if (!user) {

        this.requests = [];
        this.loading = false;

        return;
      }

      await this.loadRequests(user.uid);

    });

  }


  async loadRequests(userId: string) {

    this.loading = true;

    try {

      const requestRef = collection(
        this.firestore,
        'documentRequests'
      );

      const requestsQuery = query(
        requestRef,
        where(
          'userId',
          '==',
          userId
        )
      );

      const snapshot = await getDocs(
        requestsQuery
      );

      this.requests = snapshot.docs.map(request => {

        return {
          id: request.id,
          ...request.data()
        } as DocumentRequest;

      });

      console.log(
        'My requests loaded:',
        this.requests
      );

      this.loading = false;

    }
    catch (error) {

      console.error(
        'Error loading requests:',
        error
      );

      this.requests = [];
      this.loading = false;

    }

  }

}