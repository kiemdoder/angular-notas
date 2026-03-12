import {Injector, Signal, Type, WritableSignal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {BehaviorSubject, combineLatest, map, Observable, of} from "rxjs";
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

export interface ColumnSortOption {
  /**
   * If specified, this column will be sorted by the alternate column instead of itself.
   */
  alternateColumnId?: string;

  /**
   * Lower number means higher priority. 0 is the highest priority.
   */
  priority: number;
}

export interface ColumnDef {
  id: string;
  headerKey?: string;
  headerRenderComponent?: Type<TableHeaderCellRenderer>;
  cellValueFormatter?: CellValueFormatter;
  cellRenderComponent?: Type<TableCellRenderer>;
  draggable?: boolean;
  sort?: ColumnSortOption;
  tooltip?: string; //TODO: Implement tooltip support in header and cells based on this property
}

export type ColumnDefs = ColumnDef[];

export interface TableActionCellRenderer {
  row: WritableSignal<Row>;
  rowIdField: WritableSignal<string>;
}

export interface ActionColumnDef {
  columnId: string;
  /**
   * The field in the row data that uniquely identifies the row. This is used for selection and other row-specific actions.
   */
  rowIdField: string;
  headerCellRenderComponent: Type<any>;
  cellRenderComponent: Type<TableActionCellRenderer>;
}

export type ActionColumnDefs = ActionColumnDef[];

export type SortDirection = 'asc' | 'desc' | '';

export interface SortColumn {
  columnId: string;
  direction: SortDirection;
  /** Lower number means higher priority. 0 is the highest priority. */
  priority?: number;
}

export abstract class KdrTableDataSource extends DataSource<Row> {}

export class ArrayTableDataSource extends KdrTableDataSource {
  private readonly data$: BehaviorSubject<Row[]>;
  private readonly sortColumns?: Signal<readonly SortColumn[]>;
  private readonly injector?: Injector;

  constructor(
    private readonly originalData: Row[],
    sortColumns?: Signal<readonly SortColumn[]>,
    injector?: Injector
  ) {
    super();
    this.data$ = new BehaviorSubject<Row[]>([...originalData]);
    this.sortColumns = sortColumns;
    this.injector = injector;
  }

  connect(_collectionViewer: CollectionViewer): Observable<Row[]> {
    if (this.sortColumns && this.injector) {
      // combineLatest re-emits whenever either the data or sort state changes.
      // This is purely reactive — no effect scheduling, no timing issues.
      return combineLatest([
        this.data$,
        toObservable(this.sortColumns, { injector: this.injector })
      ]).pipe(
        map(([data, cols]) => this.sortData(data, cols))
      );
    }
    return this.data$.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.data$.complete();
  }

  private sortData(data: Row[], cols: readonly SortColumn[]): Row[] {
    if (cols.length === 0) return data;
    const ordered = [...cols].sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
    return [...data].sort((a, b) => {
      for (const sc of ordered) {
        const aVal = a[sc.columnId];
        const bVal = b[sc.columnId];
        if (aVal < bVal) return sc.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sc.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
