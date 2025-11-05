import { Component } from '@angular/core';
import { DataRow, TableCellRenderer } from '../../components/table/table';

@Component({
    template: `<span>{{ row[field] }} <strong>atomic units</strong></span>`,
    standalone: false
})
export class WeightCellComponent implements TableCellRenderer {
  field = '';
  row: DataRow = {};
}
