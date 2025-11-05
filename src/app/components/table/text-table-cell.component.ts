import { Component } from '@angular/core';
import { DataRow, TableCellRenderer } from './table';

@Component({
    template: `<span>{{ row[field] }}</span>`,
    standalone: false
})
export class TextTableCellComponent implements TableCellRenderer {
  row: DataRow = {};
  field = '';
}
