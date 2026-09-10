import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

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

  documentBreakdown$: Observable<{ name: string; count: number }[]>;

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
      map(requests =>
        requests.filter(
          request => request.status === 'pending'
        ).length
      )
    );

   
    this.approvedRequests$ = this.requests$.pipe(
      map(requests =>
        requests.filter(
          request => request.status === 'approved'
        ).length
      )
    );

    
    this.rejectedRequests$ = this.requests$.pipe(
      map(requests =>
        requests.filter(
          request => request.status === 'rejected'
        ).length
      )
    );

   
    this.documentBreakdown$ = this.requests$.pipe(

      map(requests => {

        const counts: { [key: string]: number } = {};

        requests.forEach(request => {

          const documentName = request.documentType;

          if (documentName) {

            if (!counts[documentName]) {
              counts[documentName] = 0;
            }

            counts[documentName]++;
          }

        });

        return Object.keys(counts).map(name => ({
          name: name,
          count: counts[name]
        }));

      })

    );
  }
}