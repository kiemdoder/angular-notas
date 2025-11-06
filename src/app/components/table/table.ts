import { Type, WritableSignal } from '@angular/core';

export interface DataRow {
  [field: string]: any;
}

// Legacy interface (will be deprecated)
export interface TableCellRenderer {
  row: DataRow;
  field: string;
}

// New signal-based interface
export interface TableCellRendererSignal {
  row: WritableSignal<DataRow>;
  field: WritableSignal<string>;
}

// Type guard to check if renderer uses signals
export function isSignalRenderer(renderer: TableCellRenderer | TableCellRendererSignal): renderer is TableCellRendererSignal {
  return 'set' in (renderer.row as any);
}

export interface ColumnDef {
  header?: string | ((id: string) => any);
  renderComponent?: Type<TableCellRenderer | TableCellRendererSignal>;
  tooltip?: string;
}

export interface ColumnDefs {
  [field: string]: ColumnDef;
}
