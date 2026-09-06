import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, serverTimestamp, addDoc, doc , updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface DocumentType
{
  id:string;
  name:string;
  description:string;
  fee:number;
  status:string;
}

@Component({
  selector: 'app-admin-document-type',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-document-type.html',
  styleUrl: './admin-document-type.css',
})
export class AdminDocumentType {
  editingDocumentId: string | null = null;


  private firestore = inject(Firestore);

  documentTypes$: Observable<DocumentType[]>;

  showModal = false;

  documentName = '';
  documentDescription = '';
  documentFee = 0;
  documentStatus = 'Active';

  constructor() 
  {
    const documentTypesRef = collection(
      this.firestore,
      'documentTypes'
    );

    this.documentTypes$ = collectionData(
      documentTypesRef,
      {
        idField: 'id'
      } 
    )as Observable<DocumentType[]>;

    this.documentTypes$.subscribe 
    ({
      next: (documents) => 
      {
        console.log('Document types loaded: ', documents);
      },
      error: (error) => 
      {
        console.error('Error loading document types: ', error);
      }
    });

  }

async deleteDocumentType(document: DocumentType)
{
  const confirmed = confirm(
    `Are you sure you want to delete "${document.name}"?`
  );

  if(!confirmed)
  {
    return;
  }

  try
  {
    const documentRef = doc(
      this.firestore,
      'documentTypes',
      document.id
    );

    await deleteDoc(documentRef);

    alert('Document Type deleted successfully!');
  }
  catch (error)
  {
    console.error('Error deleting document type: ',error);

    alert('Failed to delete document type.');
  }
}



  async updateDocumentType()
  {
    if(!this.editingDocumentId)
    {
      return;
    }

    if(!this.documentName.trim())
    {
      alert('Please enter a document name.');
      return;
    }
    
    if(!this.documentDescription.trim())
    {
      alert('Please enter a description.');
      return;
    }

    if(this.documentFee < 0)
    {
      alert('Fee cannot be negative.');
      return;
    }

    try
    {
      const documentRef = doc(
        this.firestore,
        'documentTypes',
        this.editingDocumentId
      );

      await updateDoc(documentRef , {
        name: this.documentName.trim(),
        description: this.documentDescription.trim(),
        fee: Number(this.documentFee),
        status: this.documentStatus
      });

      alert('Document Type updated successfully');

      this.closeModal();
    }
    catch (error)
    {
      console.error('Error updating document type: ', error);

      alert('Failed to update document type.');
    }
  }

  

  openModal()
  {
    this.showModal = true;
  }

  editDocumentType(document: DocumentType)
  {
    this.editingDocumentId = document.id;

    this.documentName = document.name;
    this.documentDescription = document.description;
    this.documentFee = document.fee;
    this.documentStatus = document.status;

    this.showModal = true;
  }

  closeModal()
  {
    this.showModal = false;

    this.editingDocumentId = null;

    this.documentName = '';
    this.documentDescription= '' ;
    this.documentFee = 0;
    this.documentStatus = 'Active';
  }
    
  async addDocumentType()
  {
    if(!this.documentName.trim())
    {
      alert('Please enter a document name. ');
      return;
    }

    if(!this.documentDescription.trim())
    {
      alert('Please enter a description')
      return;
    }

    if(this.documentFee < 0)
    {
      alert('Fee cannot be negative');
      return;
    }

    try
    {
      const documentTypesRef = collection
      (
        this.firestore,
        'documentTypes'
      );

      await addDoc(documentTypesRef, {
        name: this.documentName.trim(),
        description: this.documentDescription.trim(),
        fee: Number(this.documentFee),
        status: this.documentStatus,
        createdAt: serverTimestamp()
      });

      alert('Document Type added successfully! ')

      this.closeModal();
    }
    catch (error)
    {
        console.error('Error adding document type: ', error);

        alert('Failed to add document type. ');
    }
  }
    
}
