import {Component} from "@angular/core";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";

@Component({
  template: `
    <mat-checkbox (change)="checkStateChange($event)"></mat-checkbox>
  `,
  imports: [
    MatCheckboxModule,
    FormsModule
  ],
  standalone: true
})
export class RowSelectionActionHeaderCellComponent {

  checkStateChange($event: MatCheckboxChange) {
    console.log($event);
  }

}
