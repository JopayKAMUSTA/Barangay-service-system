import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Firestore,collection,collectionData, query,orderBy } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule],
  templateUrl: './announcement.html',
  styleUrl: './announcement.css',
})
export class Announcement {

  private firestore = inject(Firestore);

  announcements$: Observable<any[]>;

  constructor()
  {
    const announcementsRef = collection 
    (
      this.firestore,
      'announcements'
    );

    const announcementsQuery = query
  (
    announcementsRef,
    orderBy('createdAt' , 'desc')
  );

  this.announcements$ = collectionData
  (
    announcementsQuery,
    {
      idField: 'id'
    }
  );
  }
}
