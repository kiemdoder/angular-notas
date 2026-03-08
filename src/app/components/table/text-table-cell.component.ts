import { Component, signal } from '@angular/core';
import { Row, TableCellRenderer } from './table';

@Component({
  template: `<span>{{ row()[field()] }}</span>`,
  standalone: true
})
export class TextTableCellComponent implements TableCellRenderer {
  row = signal<Row>({});
  field = signal('');
}
