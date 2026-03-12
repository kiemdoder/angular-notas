import {Component, computed, inject, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Row, TableActionCellRenderer} from '../../components/table/table';
import {TableExpansionService} from '../../components/table/table-expansion.service';

@Component({
  template: `
    <button mat-icon-button (click)="toggle()">
      <mat-icon>{{ isExpanded() ? 'expand_more' : 'chevron_right' }}</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon],
  standalone: true
})
export class RowExpansionActionCellComponent implements TableActionCellRenderer {
  row = signal<Row>({});
  rowIdField = signal<string>('');

  private expansionService = inject(TableExpansionService);

  protected isExpanded = computed(() =>
    this.expansionService.expandedRowIds().has(String(this.row()[this.rowIdField()]))
  );

  protected toggle() {
    this.expansionService.toggleRow(String(this.row()[this.rowIdField()]));
  }
}