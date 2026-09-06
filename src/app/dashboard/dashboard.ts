import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, query, where} from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  firstname = '';
  loading = true;
  recentRequests: any[] =[];

  async ngOnInit()
  {
   
    try
    {
      const user = this.auth.currentUser;

      if(!user)
      {
        this.loading = false;
        return;
      }

      const userRef = doc
      (
        this.firestore,
        'users',
        user.uid
      );

      const userDoc = await getDoc(userRef);

      if(userDoc.exists())
      {
        const userData = userDoc.data();

        this.firstname = userData['firstname'] || 'resident';
      }
      else
      {
        this.firstname = 'resident';
      }
      

      const requestsRef = collection
      (
        this.firestore,
        'documentRequests'
      );

      const requestsQuery = query
      (
        requestsRef,
        where('userId', '==', user.uid)
      );

      const requestsSnapshot = await getDocs(requestsQuery);

      this.recentRequests = requestsSnapshot.docs
      .map
      (
        request => ({
          id:request.id,
          ...request.data()
        })
      )
      .sort((a: any,b: any) => {

        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);

        return dateB.getTime() - dateA.getTime();
      })
      .slice(0,5);
    }
    catch (error)
    {
      console.error('Error loading dashboard: ', error);
      
    }
    finally
    {
      this.loading = false;
    }
  }


}