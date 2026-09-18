import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-resident',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-resident.html',
  styleUrl: './admin-resident.css',
})
export class AdminResident {

  private firestore = inject(Firestore);

  residents: any[] = [];
  filteredResidents: any[] = [];

  searchText = '';

  constructor() {
    this.loadResidents();
  }

  async loadResidents() {

    try {

      const usersRef = collection(
        this.firestore,
        'users'
      );

      const residentsQuery = query(
        usersRef,
        where('role', '==', 'resident')
      );

      const snapshot = await getDocs(residentsQuery);

      this.residents = snapshot.docs.map(resident => ({
        id: resident.id,
        ...resident.data()
      }));

      this.filteredResidents = this.residents;

      console.log('Residents loaded:', this.residents);

    } catch (error) {

      console.error(
        'Error loading residents:',
        error
      );

    }

  }


  searchResidents() {

    const search = this.searchText
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredResidents = this.residents;

      return;
    }


    this.filteredResidents = this.residents.filter(
      resident => {

        const name =
          `${resident.firstname || ''} ${resident.middlename || ''} ${resident.lastname || ''}`
            .toLowerCase();

        const email =
          (resident.email || '').toLowerCase();

        const contact =
          (resident.contactNumber || '').toLowerCase();


        return (
          name.includes(search) ||
          email.includes(search) ||
          contact.includes(search)
        );

      }
    );

  }

}