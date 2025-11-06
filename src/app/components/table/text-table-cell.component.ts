import { Component, signal } from '@angular/core';
import { DataRow, TableCellRendererSignal } from './table';

@Component({
  template: `<span>{{ row()[field()] }}</span>`,
  standalone: true
})
export class TextTableCellComponent implements TableCellRendererSignal {
  row = signal<DataRow>({});
  field = signal('');
}
