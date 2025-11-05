import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf, JsonPipe } from '@angular/common';

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
      <code>{{ formGroup.value | json }}</code>
    </div>
    <div>
      <code>valid: {{ formGroup.valid | json }}</code>
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
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, JsonPipe]
})
export class FormPage {
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  formGroup = new FormGroup({
    name: this.name,
    email: this.email,
  });
}
