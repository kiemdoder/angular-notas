import {Component, signal} from '@angular/core';
import {TableHeaderCellRenderer} from "../../components/table/table";

@Component({
  template: `<span>[Atomic <em><strong>weight</strong></em>]</span>`,
  standalone: true
})
export class WeightHeaderCellComponent implements TableHeaderCellRenderer {
  key = signal('');
}
