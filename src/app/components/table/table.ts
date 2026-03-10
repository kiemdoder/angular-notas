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
  tooltip?: string;
}

export type ColumnDefs = ColumnDef[];

export type SortDirection = 'asc' | 'desc' | '';

export interface SortColumn {
  columnId: string;
  direction: SortDirection;
}

export abstract class KdrTableDataSource extends DataSource<Row> {
  protected activeSortColumns: SortColumn[] = [];

  sort(sortColumn: SortColumn): void {
    const index = this.activeSortColumns.findIndex(sc => sc.columnId === sortColumn.columnId);
    if (sortColumn.direction === '') {
      if (index !== -1) this.activeSortColumns.splice(index, 1);
    } else if (index !== -1) {
      this.activeSortColumns[index] = sortColumn;
    } else {
      this.activeSortColumns.push(sortColumn);
    }
  }

  getSortDirection(columnId: string): SortDirection {
    return this.activeSortColumns.find(sc => sc.columnId === columnId)?.direction ?? '';
  }
}

export class ArrayTableDataSource extends KdrTableDataSource {
  private data$: BehaviorSubject<Row[]>;

  constructor(private readonly originalData: Row[]) {
    super();
    this.data$ = new BehaviorSubject<Row[]>([...originalData]);
  }

  connect(_collectionViewer: CollectionViewer): Observable<Row[]> {
    return this.data$.asObservable();
  }

  disconnect(_collectionViewer: CollectionViewer): void {
    this.data$.complete();
  }

  override sort(sortColumn: SortColumn): void {
    super.sort(sortColumn);
    if (this.activeSortColumns.length === 0) {
      this.data$.next([...this.originalData]);
      return;
    }
    const sorted = [...this.originalData].sort((a, b) => {
      for (const sc of this.activeSortColumns) {
        const aVal = a[sc.columnId];
        const bVal = b[sc.columnId];
        if (aVal < bVal) return sc.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sc.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    this.data$.next(sorted);
  }
}
