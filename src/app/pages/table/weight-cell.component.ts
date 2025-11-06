import { Component, signal } from '@angular/core';
import { DataRow, TableCellRendererSignal } from '../../components/table/table';

@Component({
  template: `<span>{{ row()[field()] }} <strong>atomic units</strong></span>`,
  standalone: true
})
export class WeightCellComponent implements TableCellRendererSignal {
  field = signal('');
  row = signal<DataRow>({});
}
