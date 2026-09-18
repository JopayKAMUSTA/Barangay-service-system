import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from '@angular/fire/firestore';

import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-admin-announcement',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-announcement.html',
  styleUrl: './admin-announcement.css',
})
export class AdminAnnouncement {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  announcements: any[] = [];

  title = '';
  message = '';

  statusMessage = '';

  constructor() {

    authState(this.auth).subscribe(user => {

      console.log('Logged in user:', user);
      console.log('USER UID:', user?.uid);
      console.log('USER EMAIL:', user?.email);

    });

    this.loadAnnouncements();

  }


  async loadAnnouncements() {

    try {

      const announcementsRef = collection(
        this.firestore,
        'announcements'
      );

      const snapshot = await getDocs(
        announcementsRef
      );

      this.announcements = snapshot.docs.map(
        announcement => ({
          id: announcement.id,
          ...announcement.data()
        })
      );

      console.log(
        'Announcements loaded:',
        this.announcements
      );

    } catch (error) {

      console.error(
        'Error loading announcements:',
        error
      );

    }

  }


  async createAnnouncement() {

    if (
      !this.title.trim() ||
      !this.message.trim()
    ) {

      this.statusMessage =
        'Please enter a title and message.';

      return;
    }


    try {

      const announcementsRef = collection(
        this.firestore,
        'announcements'
      );

      await addDoc(
        announcementsRef,
        {
          title: this.title.trim(),
          message: this.message.trim(),
          createdAt: new Date()
        }
      );


      this.title = '';
      this.message = '';

      this.statusMessage =
        'Announcement posted successfully.';


      // Reload announcements
      await this.loadAnnouncements();

    } catch (error: any) {

      console.error(error);

      this.statusMessage =
        error.message;

    }

  }


  async deleteAnnouncement(id: string) {

    try {

      const announcementRef = doc(
        this.firestore,
        'announcements',
        id
      );

      await deleteDoc(
        announcementRef
      );


      this.statusMessage =
        'Announcement deleted.';


      // Reload announcements
      await this.loadAnnouncements();

    } catch (error: any) {

      console.error(error);

      this.statusMessage =
        error.message;

    }

  }

}