import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { splitFieldName } from '../../../utils/format';
import { ColumnDefs } from './table';
import { TextTableCellComponent } from './text-table-cell.component';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { TableCellComponent } from './table-cell.component';

@Component({
    selector: 'generic-table',
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.scss'],
    imports: [MatTable, NgFor, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, TableCellComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class GenericTableComponent {
  // Input signals
  data = input<any[]>([]);
  displayedColumns = input<string[]>([]);
  excludedColumns = input<string[]>([]);
  columnDefinitions = input<ColumnDefs>({});

  // Computed signals
  cols = computed(() => {
    if (this.displayedColumns().length > 0) {
      return this.displayedColumns();
    }
    const colsFromData =
      this.data() && this.data().length > 0 ? Object.keys(this.data()[0]) : [];
    return colsFromData.filter(
      (col) => this.excludedColumns().indexOf(col) === -1
    );
  });

  defaultCellRenderer = TextTableCellComponent;

  splitFieldName_(col: string) {
    return splitFieldName(col);
  }
}
