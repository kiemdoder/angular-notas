import {ChangeDetectionStrategy, Component, computed, inject, input, model, signal, Type} from '@angular/core';
import {
  ActionColumnDef,
  ActionColumnDefs,
  ArrayTableDataSource,
  ColumnDefs,
  defaultHeaderValueResolver,
  HeaderValueResolver,
  Row,
} from './table';
import {DataSource} from '@angular/cdk/table';
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
import {KdrResizableDirective} from "./kdr-resizable.directive";

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
    TableExpansionRowCellComponent, KdrResizableDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrTableComponent {
  // Input signals
  dataSource = input<DataSource<Row>>(new ArrayTableDataSource([]));
  displayedColumns = model<string[]>([]);
  columnDefinitions = input<ColumnDefs>([]);
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);
  leadingActionColumnDefinitions = input<ActionColumnDefs>([]);
  trailingActionColumnDefinitions = input<ActionColumnDefs>([]);
  expansionComponent = input<Type<any>>();
  expansionRowIdField = input<string>('');
  defaultColumnWidth = input<number>(150);
  defaultActionColumnWidth = input<number>(50);

  private expansionService = inject(TableExpansionService, { optional: true });

  private columnWidths = signal<Record<string, number>>({});

  columnWidth(col: string): number {
    return this.columnWidths()[col]
      ?? this.columnDefinition(col)?.width
      ?? this.defaultColumnWidth();
  }

  actionColumnWidth(colDef: ActionColumnDef): number {
    return colDef.width ?? this.defaultActionColumnWidth();
  }

  setColumnWidth(col: string, width: number) {
    this.columnWidths.update(w => ({...w, [col]: width}));
  }

  totalTableWidth = computed(() => {
    const leading = this.leadingActionColumnDefinitions().reduce((sum, c) => sum + this.actionColumnWidth(c), 0);
    const data = this.displayedColumns().reduce((sum, col) => sum + this.columnWidth(col), 0);
    const trailing = this.trailingActionColumnDefinitions().reduce((sum, c) => sum + this.actionColumnWidth(c), 0);
    return leading + data + trailing;
  });

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
