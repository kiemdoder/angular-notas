import { Type } from '@angular/core';

export interface TableCellRenderer {
  row: any;
  field: string;
}

export interface DataRow {
  [field: string]: any;
}

export interface ColumnDef {
  header?: string | ((id: string) => any);
  RenderComponent?: Type<TableCellRenderer>;
  tooltip?: string;
}

export interface ColumnDefs {
  [field: string]: ColumnDef;
}
