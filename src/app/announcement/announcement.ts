import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  collection,
  getDocs,
  query,
  orderBy
} from '@angular/fire/firestore';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule],
  templateUrl: './announcement.html',
  styleUrl: './announcement.css',
})
export class Announcement {

  private firestore = inject(Firestore);


  // ==========================================
  // ANNOUNCEMENTS
  // ==========================================

  announcements: any[] = [];


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    this.loadAnnouncements();

  }


  // ==========================================
  // LOAD ANNOUNCEMENTS
  // ==========================================

  async loadAnnouncements() {

    try {

      const announcementsRef = collection(
        this.firestore,
        'announcements'
      );


      const announcementsQuery = query(

        announcementsRef,

        orderBy(
          'createdAt',
          'desc'
        )

      );


      const snapshot =
        await getDocs(
          announcementsQuery
        );


      this.announcements =
        snapshot.docs.map(announcement => {

          return {

            id: announcement.id,

            ...announcement.data()

          };

        });


      console.log(
        'Announcements loaded:',
        this.announcements
      );

    }

    catch (error) {

      console.error(
        'Error loading announcements:',
        error
      );

    }

  }

}