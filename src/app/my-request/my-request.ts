import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';

interface DocumentRequest 
{
  id:string;
  userId: string;
  email:string;
  documentType:string;
  documentTypeId:string;
  purpose:string;
  fee:number;
  status:string;
  remarks:string;
  createdAt:any;
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

  requests: Observable<DocumentRequest[]> | null = null;

  loading = true;

  constructor()
  {
    authState(this.auth).subscribe(async user => {

      if(!user)
      {
        this.requests = null;
        this.loading = false;
        return;
      }

      await this.loadRequests(user.uid);
    });
  }


  async loadRequests(userId: string)
  {
    this.loading = true;

    try
    {
      const requestRef = collection(
        this.firestore,
        'documentRequests'
      );

      const requestsQuery = query(
        requestRef,
        where('userId', '==' , userId)  
      );

      this.requests = collectionData(
        requestsQuery,
        {
          idField: 'id'
        }
      ) as Observable<DocumentRequest[]>;

      this.loading = false;
    }
    catch (error)
    {
        console.error(
          'Error loading requests: ',
          error
        );

        this.loading = false;
    }
  }
 
}
