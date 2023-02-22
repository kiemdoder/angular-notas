import { Type } from '@angular/core';

export interface DataRow {
  [field: string]: any;
}

export interface TableCellRenderer {
  row: DataRow;
  field: string;
}

export interface ColumnDef {
  header?: string | ((id: string) => any);
  renderComponent?: Type<TableCellRenderer>;
  tooltip?: string;
}

export interface ColumnDefs {
  [field: string]: ColumnDef;
}
