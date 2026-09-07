import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore,collection,collectionData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

interface DocumentRequest
{
  id:string;

  firstname:string;
  middlename:string;
  lastname: string;
  email:string;

  documentType:string;
  fee:number;

  status:string;
  paymentStatus:string;

  createdAt:any;
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

  requests$: Observable<DocumentRequest[]>;

  constructor()
  {

    const requestsRef = collection(
      this.firestore,
      'documentRequests'
    );

    this.requests$ = collectionData(
      requestsRef,
      {
        idField:'id'
      }
    ) as Observable<DocumentRequest[]>;
  }

  getPaidRequests(
    requests:DocumentRequest[]
  ): DocumentRequest[]
  {
    return requests.filter(
      request => request.paymentStatus === 'Paid'
    );
  }

  getTotalEarnings(
    requests: DocumentRequest[]
  ): number
  {
    return this.getPaidRequests(requests).reduce
    (
      (total,request) => total + Number(request.fee || 0),
      0
    );
  }
  getPaidCount(
    requests: DocumentRequest[]
  ):number
  {
    return this.getPaidRequests(requests).length;
  }

  getPendingPayment(
    requests:DocumentRequest[]
  ): number 
  {
    return requests.filter
    (
      request => request.paymentStatus !== 'Paid'
    )
    .reduce(
      (total, request) => total + Number(request.fee || 0),
      0
    );
  }

}
