import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Firestore, collection, addDoc, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  announcements$ : Observable<any[]>;

  title = '';
  message = '';

  statusMessage = '';
  
  constructor() {

    authState(this.auth).subscribe(user => {
      
      console.log('Logged in user:', user);
      console.log('USER UID:', user?.uid);
      console.log('USER EMAIL:', user?.email);
    });

    const announcementsRef = collection(
      this.firestore,
      'announcements'
    );

    this.announcements$ = collectionData(
      announcementsRef,
      {
        idField: 'id'
      }
    );
  }

  async createAnnouncement(){

    if (!this.title.trim() || !this.message.trim()) {

      this.statusMessage = 'Please enter a title and message.';

      return;
    }
    
    try{

      const announcementsRef = collection(
        this.firestore,
        'announcements'
      );

      await addDoc(
        announcementsRef,
        {
          title: this.title,
          message: this.message,
          createdAt: new Date()
        }
      );

      this.title = '';
      this.message = '';

      this.statusMessage = 'Announcement posted successfully.';

    }
    catch (error: any){

      console.error(error);

      this.statusMessage = error.message;
    }
  }

  async deleteAnnouncement(id: string){

    try{
      
      const announcementRef = doc(
        this.firestore,
        'announcements',
        id
      );

      await deleteDoc(announcementRef);

      this.statusMessage = 'Announcement deleted.';
    } catch (error: any) {

      console.error(error);

      this.statusMessage = error.message;
    }
  }

}
