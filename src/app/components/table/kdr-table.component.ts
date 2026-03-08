import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { splitFieldName } from '../../../utils/format';
import {ArrayTableDataSource, ColumnDefs, defaultHeaderValueResolver, HeaderValueResolver, Row} from './table';
import { TextTableCellComponent } from './text-table-cell.component';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { TableCellComponent } from './table-cell.component';
import {DataSource} from "@angular/cdk/table";
import {TableHeaderCellComponent} from "./table-header-cell.component";

/**
 * A generic table component that can be used to display any type of data in a tabular format.
 * It will automatically generate columns based on the data provided, but also allows for customization of the displayed columns and their order.
 */
@Component({
  selector: 'kdr-table',
  templateUrl: './kdr-table.component.html',
  styleUrls: ['./kdr-table.component.scss'],
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, TableCellComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, TableHeaderCellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrTableComponent {
  // Input signals
  dataSource = input<DataSource<Row>>(new ArrayTableDataSource([]));
  displayedColumns = input<string[]>([]);
  columnDefinitions = input<ColumnDefs>([]);
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);

  defaultCellRenderer = TextTableCellComponent;

  columnDefinition(col: string) {
    return this.columnDefinitions().find(def => def.id === col);
  }
}
