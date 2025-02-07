import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('./contact-list/contact-list.component').then((c) => c.ContactListComponent),
      },
      {
        path: 'contact-action',
        loadComponent: () =>
          import('./contacts-action/contacts-action.component').then((c) => c.ContactsActionComponent),
      },
      
];
