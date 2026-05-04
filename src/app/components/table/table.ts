import {Injector, Signal, Type, WritableSignal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {BehaviorSubject, combineLatest, map, Observable, of} from "rxjs";
import {DataSource} from "@angular/cdk/table";
import {CollectionViewer} from "@angular/cdk/collections";

export type Row = Record<string, any>;

/**
 * Table cell render components should implement this interface.
 */
export interface TableCellRenderer {
  /**
   * The row data for the current cell. The renderer can use this to access other fields in the same row if needed.
   */
  row: WritableSignal<Row>;
  /**
   * The field name of one of the fields in the row object. This can be used to look
   * up the value to display in the cell.
   */
  field: WritableSignal<string>;
}

/**
 * A function that takes a header key and returns an observable of the header value to display. This will typically
 * be a function that will look up the translation for the header text from the key.
 */
export type HeaderValueResolver = (headerKey: string) => Observable<string>;
export const defaultHeaderValueResolver: HeaderValueResolver = (headerKey: string) => of(headerKey);

/**
 * Table header cell render components should implement this interface.
 */
export interface TableHeaderCellRenderer {
  /**
   * The key that will be used to get the translation for the name of the column.
   */
  headerNameKey: WritableSignal<string>;

  /**
   * The function that will be used to look up the header value from the {@link headerNameKey}.
   */
  headerValueResolver?: WritableSignal<HeaderValueResolver>;
}

export type CellValue = string | boolean | number;
/**
 * A formatter function that will be used to format the string value of a cell.
 * When structural formatting for a cell is required, use a {@link TableCellRenderer}.
 */
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
  /**
   * The ID of the column. In most cases this ID will be the field in the row data
   * object that will be displayed in this column.
   */
  id: string;

  /**
   * A key that will be used to look up the translation for the header text of this column.
   */
  headerKey?: string;

  /**
   * A component that will be used to render the header cell.
   */
  headerRenderComponent?: Type<TableHeaderCellRenderer>;

  /**
   * A string value formatter for the cells in this column.
   * For structural formatting, use the {@link cellRenderComponent}
   */
  cellValueFormatter?: CellValueFormatter;

  /**
   * An optional component that can be used to render the contents of a cell when special
   * structural formatting is required.
   */
  cellRenderComponent?: Type<TableCellRenderer>;

  /**
   * Set to true to enable this column to be draggable for reordering.
   * Columns are not draggable by default.
   */
  draggable?: boolean;

  /**
   * Set to true to make the column sortable.
   * Columns are not sortable by default.
   */
  sort?: ColumnSortOption;

  /**
   * An optional fixed width for the column.
   */
  width?: number;

  /**
   * An optional minimum width for the column.
   */
  minWidth?: number;

  /**
   * An optional maximum width for the column.
   */
  maxWidth?: number;

  tooltip?: string; //TODO: Implement tooltip support in header and cells based on this property
}

export type ColumnDefs = ColumnDef[];

/**
 * Table action cell components should implement this interface. An action cell is a component
 * that can be used to perform some action on a row like editing a row.
 */
export interface TableActionCellRenderer {
  /**
   * The row data for the cell.
   */
  row: WritableSignal<Row>;

  /**
   * A field in the row data that represents the ID for the row.
   */
  rowIdField: WritableSignal<string>;
}

/**
 * The definition of an action column. An action column is a special type of column that is used to render action cells.
 * It has a reference to the field in the row data that represents the ID for the row, which can be used for
 * performing actions on the row like editing or deleting.
 */
export interface ActionColumnDef {
  columnId: string; //TODO: do we really need this ID or can it be generated?

  /**
   * The field in the row data that uniquely identifies the row. This is used for selection and other row-specific actions.
   */
  rowIdField: string;

  /**
   * A component that is used to render the header cell for the action column.
   */
  headerCellRenderComponent: Type<any>;

  /**
   * A component that is used to render the cells in the action column.
   * This component should implement the {@link TableActionCellRenderer} interface.
   */
  cellRenderComponent: Type<TableActionCellRenderer>;

  /**
   * An optional fixed width for the action column.
   */
  width?: number;
}

export type ActionColumnDefs = ActionColumnDef[];

export interface PageState {
  /**
   * The index of the current page being displayed.
   */
  pageIndex: number;

  /**
   * The number of rows in a page.
   */
  pageSize: number;
}

export type SortDirection = 'asc' | 'desc' | '';

export interface SortColumn {
  columnId: string;
  direction: SortDirection;
  /** Lower number means higher priority. 0 is the highest priority. */
  priority?: number;
}

/**
 * A simple datasource where all the table data is in an array.
 */
export class ArrayTableDataSource extends DataSource<Row> {
  private readonly data$: BehaviorSubject<Row[]>;
  private readonly sortColumns?: Signal<readonly SortColumn[]>;
  private readonly pageState?: Signal<PageState>;
  private readonly injector?: Injector;

  constructor(
    originalData: Row[],
    sortColumns?: Signal<readonly SortColumn[]>,
    injector?: Injector,
    pageState?: Signal<PageState>,
  ) {
    super();
    this.data$ = new BehaviorSubject<Row[]>([...originalData]);
    this.sortColumns = sortColumns;
    this.injector = injector;
    this.pageState = pageState;
  }

  connect(_collectionViewer: CollectionViewer): Observable<Row[]> {
    if (this.injector && (this.sortColumns || this.pageState)) {
      return combineLatest([
        this.data$,
        this.sortColumns ? toObservable(this.sortColumns, { injector: this.injector }) : of([] as SortColumn[]),
        this.pageState ? toObservable(this.pageState, { injector: this.injector }) : of(undefined),
      ]).pipe(
        map(([data, cols, page]) => {
          const sorted = this.sortData(data, cols);
          if (!page) return sorted;
          const start = page.pageIndex * page.pageSize;
          return sorted.slice(start, start + page.pageSize);
        })
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
