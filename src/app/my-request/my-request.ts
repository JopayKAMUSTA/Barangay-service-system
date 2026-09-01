import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

import { Firestore, collection, query, where, orderBy, collectionData } from '@angular/fire/firestore';

import { Observable, of} from 'rxjs';

@Component({
  selector: 'app-my-request',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-request.html',
  styleUrl: './my-request.css',
})
export class MyRequest {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  requests$: Observable<any[]> = of([]);

  constructor(){

    authState(this.auth).subscribe(user =>{

      if(!user){
        console.log('No logged-in user');
        return;
      }

      const requestsRef = collection(
        this.firestore,
        'documentRequests'
      );

      const requestQuery = query (
        requestsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      this.requests$ = collectionData(
        requestQuery,
        {
          idField:'id'
        }
      );
    });
  }
}
