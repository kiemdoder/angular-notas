import {Component} from "@angular/core";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'checkbox-action-header-cell',
  template: `
    <mat-checkbox (change)="checkStateChange($event)"></mat-checkbox>
  `,
  imports: [
    MatCheckboxModule,
    FormsModule
  ],
  standalone: true
})
export class CheckboxActionHeaderCellComponent {

  checkStateChange($event: MatCheckboxChange) {
    console.log($event);
  }

}
