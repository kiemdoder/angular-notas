import {Component, EventEmitter, signal} from "@angular/core";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {Row, TableActionCellRenderer} from "../../components/table/table";
import {TableSelectionService} from "../../components/table/table-selection.service";

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
export class RowSelectionActionCellComponent implements TableActionCellRenderer {

  constructor(private tableSelectionService: TableSelectionService) {}

  row = signal<Row>({});
  rowIdField = signal<string>('');

  checkStateChange($event: MatCheckboxChange) {
    if ($event.checked) {
      this.tableSelectionService.selectRow(this.row()[this.rowIdField()]);
    } else {
      this.tableSelectionService.deselectRow(this.row()[this.rowIdField()]);
    }
  }

}
