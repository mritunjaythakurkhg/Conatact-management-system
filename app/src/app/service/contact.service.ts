import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Contact } from '../types/contact.types';
import { CONTACTS } from '../constants/contacts.constants';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [...CONTACTS];
  private _snackBar = inject(MatSnackBar)


  getContacts(): Contact[] {
    return this.contacts;
  }

  getContact(index: number): Contact {
    return this.contacts[index];
  }

  updateContact(index: number, updatedContact: Contact) {
    if (index >= 0 && index < this.contacts.length) {
      this.contacts[index] = updatedContact;
      this._snackBar.open('Contact Updated Successfully', 'X', {
        duration: 3000
      })
    }

  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
  }

  addContact(contact: Contact) {
    this.contacts.push(contact);
    this._snackBar.open('Contact added Successfully','❌', {
      duration: 3000
    } )
  }
  
  deleteContactByIndex(contactId: number) {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this._snackBar.open('Contact Deleted Successfully', '❌' , {
      duration: 3000
    });
  }
}
