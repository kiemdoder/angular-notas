import { Component, signal } from '@angular/core';
import { DataRow, TableCellRenderer } from './table';

@Component({
  template: `<span>{{ row()[field()] }}</span>`,
  standalone: true
})
export class TextTableCellComponent implements TableCellRenderer {
  row = signal<DataRow>({});
  field = signal('');
}
