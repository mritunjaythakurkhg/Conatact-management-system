import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactService } from '../service/contact.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Contact } from '../types/contact.types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts-action',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './contacts-action.component.html',
})
export class ContactsActionComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  contactForm: FormGroup;
  contactIndex: number | null = null;
  isEditMode: boolean = false;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['index'] !== undefined) {
        this.contactIndex = +params['index'];
        const contact = this.contactService.getContact(this.contactIndex);
        if (contact) {
          this.contactForm.patchValue(contact);
          this.isEditMode = true;
        }
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const contactData: Contact = this.contactForm.value;

      if (this.contactIndex !== null) {
        this.contactService.updateContact(this.contactIndex, contactData);
      } else {
        this.contactService.addContact(contactData);
      }
      this.router.navigate(['/']);
    }
  }
}
