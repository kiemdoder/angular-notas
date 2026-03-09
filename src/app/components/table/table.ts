import {Type, WritableSignal} from '@angular/core';
import {Observable, of} from "rxjs";
import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";

export interface Row {
  [field: string]: any;
}

export interface TableCellRenderer {
  row: WritableSignal<Row>;
  field: WritableSignal<string>;
}

export type HeaderValueResolver = (headerKey: string) => Observable<string>;
export const defaultHeaderValueResolver: HeaderValueResolver = (headerKey: string) => of(headerKey);

export interface TableHeaderCellRenderer {
  key: WritableSignal<string>;
  headerValueResolver?: WritableSignal<HeaderValueResolver>;
}

export type CellValue = string | boolean | number;
export type CellValueFormatter = (fieldValue: CellValue) => string | Promise<string>;

export interface ColumnDef {
  id: string;
  headerKey?: string;
  headerRenderComponent?: Type<TableHeaderCellRenderer>;
  cellValueFormatter?: CellValueFormatter;
  cellRenderComponent?: Type<TableCellRenderer>;
  draggable?: boolean;
  tooltip?: string;
}

export type ColumnDefs = ColumnDef[];

export class ArrayTableDataSource extends DataSource<Row> {
  constructor(private data: Row[]) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Row[]> {
    return new Observable(subscriber => {
      subscriber.next(this.data);
      subscriber.complete();
    });
  }

  disconnect(collectionViewer: CollectionViewer): void {
    // No cleanup needed for this simple implementation
  }
}
