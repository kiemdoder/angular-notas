import {Type, WritableSignal} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
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
  sortable?: boolean;
  tooltip?: string;
}

export type ColumnDefs = ColumnDef[];

export interface SortColumn {
  columnId: string;
  direction: 'asc' | 'desc' | '';
}

export abstract class KdrTableDataSource extends DataSource<Row> {
  public sort(sortColumn: SortColumn){
  };
}

export class ArrayTableDataSource extends KdrTableDataSource {
  private data$: BehaviorSubject<Row[]>;

  constructor(private data: Row[]) {
    super();
    this.data$ = new BehaviorSubject<Row[]>(data);
  }

  connect(collectionViewer: CollectionViewer): Observable<Row[]> {
    return this.data$.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.data$.complete();
  }

  override sort(sortColumn: SortColumn) {
    const sorted = [...this.data].sort((a, b) => {
      const aVal = a[sortColumn.columnId];
      const bVal = b[sortColumn.columnId];
      if (aVal < bVal) return sortColumn.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortColumn.direction === 'asc' ? 1 : -1;
      return 0;
    });
    this.data$.next(sorted);
  }
}
