import {computed, Injectable, Signal, signal} from '@angular/core';
import {SortColumn, SortDirection} from './table';

@Injectable()
export class TableSortService {
  /** When true (default), multiple columns can be sorted simultaneously.
   *  When false, clicking a new column replaces all existing sorts. */
  multiColumnSort = signal(true);

  private readonly _activeSortColumns = signal<SortColumn[]>([]);

  // Read-only — consumers watch but cannot mutate directly
  readonly activeSortColumns: Signal<readonly SortColumn[]> = computed(() => this._activeSortColumns());

  sort(sortColumn: SortColumn): void {
    this._activeSortColumns.update(cols => {
      const index = cols.findIndex(sc => sc.columnId === sortColumn.columnId);
      if (sortColumn.direction === '') {
        // Clear this column — remove it from the list
        return cols.filter(sc => sc.columnId !== sortColumn.columnId);
      } else if (index !== -1) {
        // Cycle direction on an already-active column — update in place
        return cols.map(sc => sc.columnId === sortColumn.columnId ? sortColumn : sc);
      } else if (this.multiColumnSort()) {
        // Multi-column mode: append the new column to existing sorts
        return [...cols, sortColumn];
      } else {
        // Single-column mode: replace all existing sorts with this one
        return [sortColumn];
      }
    });
    console.log('Active sort columns:', this._activeSortColumns());
  }

  getSortDirection(columnId: string): SortDirection {
    return this._activeSortColumns().find(sc => sc.columnId === columnId)?.direction ?? '';
  }

  clearSort(): void {
    this._activeSortColumns.set([]);
  }
}
