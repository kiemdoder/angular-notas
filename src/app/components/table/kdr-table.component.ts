import {ChangeDetectionStrategy, Component, computed, inject, input, model, Type} from '@angular/core';
import {
  ActionColumnDefs,
  ArrayTableDataSource,
  ColumnDefs,
  defaultHeaderValueResolver,
  HeaderValueResolver,
  KdrTableDataSource,
} from './table';
import {TextTableCellComponent} from './text-table-cell.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {TableCellComponent} from './table-cell.component';
import {TableHeaderCellComponent} from "./table-header-cell.component";
import {DefaultTableHeaderCellComponent} from "./default-table-header-cell.component";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {KdrSortHeaderComponent} from "./kdr-sort-header.component";
import {TableActionHeaderCellComponent} from "./table-action-header-cell.component";
import {TableActionCellComponent} from "./table-action-cell.component";
import {TableExpansionService} from "./table-expansion.service";
import {TableExpansionRowCellComponent} from "./table-expansion-row-cell.component";

/**
 * A generic table component that can be used to display any type of data in a tabular format.
 * It will automatically generate columns based on the data provided, but also allows for customization of the displayed columns and their order.
 */
@Component({
  selector: 'kdr-table',
  templateUrl: './kdr-table.component.html',
  styleUrls: ['./kdr-table.component.scss'],
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
    TableCellComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, TableHeaderCellComponent,
    CdkDropList, CdkDrag, KdrSortHeaderComponent, TableActionHeaderCellComponent, TableActionCellComponent,
    TableExpansionRowCellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrTableComponent {
  // Input signals
  dataSource = input<KdrTableDataSource>(new ArrayTableDataSource([]));
  displayedColumns = model<string[]>([]);
  columnDefinitions = input<ColumnDefs>([]);
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);
  leadingActionColumnDefinitions = input<ActionColumnDefs>([]);
  trailingActionColumnDefinitions = input<ActionColumnDefs>([]);
  expansionComponent = input<Type<any>>();
  expansionRowIdField = input<string>('');

  private expansionService = inject(TableExpansionService, { optional: true });

  defaultCellRenderer = TextTableCellComponent;
  defaultHeaderCellRenderer = DefaultTableHeaderCellComponent;

  allColumns = computed(() => {
    return [
      ...this.leadingActionColumnDefinitions().map(def => def.columnId),
      ...this.displayedColumns(),
      ...this.trailingActionColumnDefinitions().map(def => def.columnId)
    ];
  })

  isExpanded(row: any): boolean {
    return !!this.expansionComponent()
      && !!this.expansionService?.expandedRowIds().has(String(row[this.expansionRowIdField()]));
  }

  columnDefinition(col: string) {
    return this.columnDefinitions().find(def => def.id === col);
  }

  protected drop($event: CdkDragDrop<any, any>) {
    const targetCol = this.displayedColumns()[$event.currentIndex];
    if (!this.columnDefinition(targetCol)?.draggable) {
      // If the target column is not draggable, do not allow dropping here
      return;
    }

    this.displayedColumns.update(cols => {
      const copy = [...cols];
      moveItemInArray(copy, $event.previousIndex, $event.currentIndex);
      return copy;
    });
  }

}
