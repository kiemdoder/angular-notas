import { Type, WritableSignal } from '@angular/core';

export interface DataRow {
  [field: string]: any;
}

// New signal-based interface
export interface TableCellRenderer {
  row: WritableSignal<DataRow>;
  field: WritableSignal<string>;
}

export interface ColumnDef {
  header?: string | ((id: string) => any);
  renderComponent?: Type<TableCellRenderer>;
  tooltip?: string;
}

export interface ColumnDefs {
  [field: string]: ColumnDef;
}
