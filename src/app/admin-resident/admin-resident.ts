import { Component, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection,collectionData, query, where } from '@angular/fire/firestore';
import { Observable, map, combineLatest, startWith } from 'rxjs';

@Component({
  selector: 'app-admin-resident',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-resident.html',
  styleUrl: './admin-resident.css',
})
export class AdminResident {

  private firestore = inject(Firestore);

  residents$: Observable<any[]>;
  
  filteredResidents$: Observable <any[]>;

  searchText = '';

  constructor() {

    const usersRef = collection(
      this.firestore,
      'users'
    );

    const residentsQuery = query(
      usersRef,
      where('role','==' ,'resident')
    );

    this.residents$ = collectionData(
      residentsQuery,
      {
        idField:'id'
      }
    );
    
    this.filteredResidents$ = this.residents$;
    
  }
  searchResidents(){

    const search = this.searchText
      .toLowerCase()
      .trim();

      this.filteredResidents$ = this.residents$.pipe(

        map(residents => {

          if(!search){
            return residents;
          }

          return residents.filter(resident => {
             
            const name = `${resident.firstname || ''} ${resident.middlename || ''} ${resident.lastname || ''} `.toLowerCase();
          
            const email = (resident.email || '').toLowerCase();

            const contact = (resident.contactNumber || '').toLowerCase();

            return (
              name.includes(search) ||
              email.includes(search) ||
              contact.includes(search)
            );
          });
        })
      );
  }


  
}
