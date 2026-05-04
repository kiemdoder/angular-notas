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
 * A flexible, feature-rich table component with support for sorting, column reordering,
 * resizable columns, row expansion, and action columns.
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

  /**
   * A CDK table datasource
   */
  dataSource = input<DataSource<Row>>(new ArrayTableDataSource([]));

  /**
   * The IDs of the columns that needs to be displayed in the order that they should be displayed.
   */
  displayedColumns = model<string[]>([]); //TODO: should we not derive this from the column definitions?

  /**
   * Definitions of the table columns.
   */
  columnDefinitions = input<ColumnDefs>([]);

  /**
   * A function that will resolve the value of a header cell from the header key.
   */
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);

  /**
   * Definitions for action header cells that will be displayed on the left side of the table.
   */
  leadingActionColumnDefinitions = input<ActionColumnDefs>([]);

  /**
   * Definitions for action header cells that will be displayed on the right side of the table.
   */
  trailingActionColumnDefinitions = input<ActionColumnDefs>([]);

  /**
   * A component that is responsible for rendering the content of an expanded row.
   */
  expansionComponent = input<Type<any>>();

  /**
   * A field in the row data that will be used as the unique identifier for expansion.
   * This is required for the table to keep track of which rows are expanded.
   */
  expansionRowIdField = input<string>('');

  /**
   * The default column width that will be applied to all data columns.
   * Columns widths can be overridden in {@link columnDefinitions}
   */
  defaultColumnWidth = input<number>(150);

  /**
   * The default column width that will be applied to all action columns.
   * Columns widths for action columns can be overridden in {@link leadingActionColumnDefinitions}
   * and {@link trailingActionColumnDefinitions}
   */
  defaultActionColumnWidth = input<number>(50);

  /**
   * The expansionService is responsible for keeping track of which rows are in an expanded state.
   */
  private expansionService = inject(TableExpansionService, { optional: true });

  /**
   * Stores dynamically adjusted column widths, overriding default and configured widths.
   */
  private columnWidths = signal<Record<string, number>>({});

  /**
   * Returns the effective width for a data column, prioritizing dynamic adjustments,
   * then column definition width, and finally the default column width.
   */
  columnWidth(col: string): number {
    return this.columnWidths()[col]
      ?? this.columnDefinition(col)?.width
      ?? this.defaultColumnWidth();
  }

  /**
   * Returns the effective width for an action column, using the column's configured width
   * or falling back to the default action column width.
   */
  actionColumnWidth(colDef: ActionColumnDef): number {
    return colDef.width ?? this.defaultActionColumnWidth();
  }

  /**
   * Dynamically sets the width for a specific column, typically called during resize operations.
   */
  setColumnWidth(col: string, width: number) {
    this.columnWidths.update(w => ({...w, [col]: width}));
  }

  /**
   * Computes the total width of the table by summing all leading action columns,
   * data columns, and trailing action columns.
   */
  totalTableWidth = computed(() => {
    const leading = this.leadingActionColumnDefinitions().reduce((sum, c) => sum + this.actionColumnWidth(c), 0);
    const data = this.displayedColumns().reduce((sum, col) => sum + this.columnWidth(col), 0);
    const trailing = this.trailingActionColumnDefinitions().reduce((sum, c) => sum + this.actionColumnWidth(c), 0);
    return leading + data + trailing;
  });

  /**
   * The default component used to render data cell content when no custom renderer is specified.
   */
  defaultCellRenderer = TextTableCellComponent;

  /**
   * The default component used to render header cell content when no custom renderer is specified.
   */
  defaultHeaderCellRenderer = DefaultTableHeaderCellComponent;

  /**
   * Computes all column IDs in display order: leading actions, data columns, then trailing actions.
   */
  allColumns = computed(() => {
    return [
      ...this.leadingActionColumnDefinitions().map(def => def.columnId),
      ...this.displayedColumns(),
      ...this.trailingActionColumnDefinitions().map(def => def.columnId)
    ];
  })

  /**
   * Checks if a row is currently in an expanded state.
   * Returns false if expansion is not configured or the row is collapsed.
   */
  isExpanded(row: any): boolean {
    return !!this.expansionComponent()
      && !!this.expansionService?.expandedRowIds().has(String(row[this.expansionRowIdField()]));
  }

  /**
   * Retrieves the column definition for a given column ID.
   */
  columnDefinition(col: string) {
    return this.columnDefinitions().find(def => def.id === col);
  }

  /**
   * Handles column reordering via drag-and-drop.
   * Only allows dropping onto draggable columns to prevent invalid reordering.
   */
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
