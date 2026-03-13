import {Component, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Row, TableActionCellRenderer} from '../../components/table/table';

@Component({
  template: `
    <button mat-icon-button aria-label="Row actions">
      <mat-icon>more_vert</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon],
  standalone: true
})
export class RowActionsCellComponent implements TableActionCellRenderer {
  row = signal<Row>({});
  rowIdField = signal<string>('');
}