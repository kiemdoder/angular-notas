import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf, JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    template: `
    <form class="form-container">
      <mat-form-field>
        <mat-label>Enter your name</mat-label>
        <input
          matInput
          placeholder="Clark Kent"
          required
          [formControl]="name"
        />
        <mat-error *ngIf="name.hasError('required')">Required</mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Enter your email address</mat-label>
        <input
          type="email"
          matInput
          placeholder="name@mail.com"
          required
          [formControl]="email"
        />
        <mat-error *ngIf="email.invalid">{{
          email.hasError('required')
            ? 'Required'
            : email.hasError('email')
            ? 'Invalid email address'
            : ''
        }}</mat-error>
      </mat-form-field>
    </form>
    <div>
      <code>{{ formValue() | json }}</code>
    </div>
    <div>
      <code>valid: {{ isFormValid() }}</code>
    </div>
    <div>
      <code>dirty: {{ isFormDirty() }}</code>
    </div>
  `,
    styles: [
        `
      .form-container {
        display: flex;
        flex-direction: column;
        width: 200px;
      }
    `,
    ],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, JsonPipe],
    standalone: true
})
export class FormPage {
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  formGroup = new FormGroup({
    name: this.name,
    email: this.email,
  });

  // Convert form observables to signals
  formValue = toSignal(this.formGroup.valueChanges, {
    initialValue: this.formGroup.value
  });
  formStatus = toSignal(this.formGroup.statusChanges, {
    initialValue: this.formGroup.status
  });

  // Computed signals for form state
  isFormValid = computed(() => this.formStatus() === 'VALID');
  isFormDirty = computed(() => this.formGroup.dirty);
  isFormTouched = computed(() => this.formGroup.touched);
}
