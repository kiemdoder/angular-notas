import { Component, Input, OnInit } from '@angular/core';
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
    imports: [MatTable, NgFor, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, TableCellComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class GenericTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() excludedColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefs = {};
  cols: string[] = [];
  defaultCellRenderer = TextTableCellComponent;

  ngOnInit(): void {
    if (this.displayedColumns.length > 0) {
      this.cols = this.displayedColumns;
    } else {
      const colsFromData =
        this.data && this.data.length > 0 ? Object.keys(this.data[0]) : [];
      this.cols = colsFromData.filter(
        (col) => this.excludedColumns.indexOf(col) === -1
      );
    }
  }

  splitFieldName_(col: string) {
    return splitFieldName(col);
  }
}
