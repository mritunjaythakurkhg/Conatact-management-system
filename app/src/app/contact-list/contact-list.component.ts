import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Contact } from '../types/contact.types';
import { CONTACTS } from '../constants/contacts.constants';
import { ContactService } from '../service/contact.service';
import { FormsModule } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  private router = inject(Router);
  private contactsService = inject(ContactService);

  contacts: Contact[] = [];
  currentPage: number = 0;
  pageSize: number = 9;
  totalPages: number = 0;
  searchQuery: string = '';
  filteredContacts: Contact[] = [];

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contacts = this.contactsService.getContacts();
    this.filteredContacts = [...this.contacts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.updatePagination();
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize);
  }

  editContact(contact: Contact) {
    const originalIndex = this.contacts.findIndex(c => c.name === contact.name && c.phone === contact.phone);
  
    if (originalIndex !== -1) {
      this.router.navigate(['/contact-action'], { queryParams: { index: originalIndex } });
    }
  }

  deleteContact(index: number) {
    const contactToDelete = this.paginatedContacts[index]; 
    this.contactsService.deleteContactByIndex(contactToDelete.id); 
    this.loadContacts();
    this.searchContacts();
  }

  searchContacts() {
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      this.filteredContacts = [...this.contacts]; 
    } else {
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.phone.includes(query)
      );
    }
    this.currentPage = 0; 
    this.updatePagination();
  }

  get paginatedContacts(): Contact[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredContacts.slice(start, end);
  }

  goToPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getMin(start: number, end: number): number {
    return Math.min(start, end);
  }

  getDisplayedPages(): number[] {
    const firstPage = Math.max(this.currentPage - 2, 0);
    const lastPage = Math.min(this.currentPage + 2, this.totalPages - 1);
  
    return Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i);
  }

  addContact() {
    this.router.navigate(['/contact-action']);
  }
}
