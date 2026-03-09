import {ChangeDetectionStrategy, Component, input, model} from '@angular/core';
import {
  ArrayTableDataSource,
  ColumnDefs,
  defaultHeaderValueResolver,
  HeaderValueResolver,
  KdrTableDataSource,
  Row
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
import {DataSource} from "@angular/cdk/table";
import {TableHeaderCellComponent} from "./table-header-cell.component";
import {DefaultTableHeaderCellComponent} from "./default-table-header-cell.component";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";

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
    CdkDropList, CdkDrag, MatSort, MatSortHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrTableComponent {
  // Input signals
  dataSource = input<KdrTableDataSource>(new ArrayTableDataSource([]));
  displayedColumns = model<string[]>([]);
  columnDefinitions = input<ColumnDefs>([]);
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);

  defaultCellRenderer = TextTableCellComponent;
  defaultHeaderCellRenderer = DefaultTableHeaderCellComponent;

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

  protected sortData($event: Sort) {
      this.dataSource().sort({columnId: $event.active, direction: $event.direction});
  }
}
