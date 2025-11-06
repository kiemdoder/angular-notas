import { Component, signal } from '@angular/core';
import { DataRow, TableCellRenderer } from '../../components/table/table';

@Component({
  template: `<span>{{ row()[field()] }} <strong>atomic units</strong></span>`,
  standalone: true
})
export class WeightCellComponent implements TableCellRenderer {
  field = signal('');
  row = signal<DataRow>({});
}
