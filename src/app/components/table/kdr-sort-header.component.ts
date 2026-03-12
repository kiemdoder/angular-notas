import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {SortDirection} from './table';
import {TableSortService} from './table-sort.service';

@Component({
  selector: 'kdr-sort-header',
  template: `
    <button (click)="onClick()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrSortHeaderComponent {
  // The resolved column ID to sort by (alternateColumnId already applied by the parent template)
  columnId = input.required<string>();

  private sortService = inject(TableSortService);

  // Read activeSortColumns() directly so Angular's reactive tracking has a clear,
  // unambiguous dependency on the public signal rather than going through a method call.
  private sortDirection = computed(() =>
    this.sortService.activeSortColumns()
      .find(sc => sc.columnId === this.columnId())?.direction ?? ''
  );

  protected icon = computed(() => {
    const dir = this.sortDirection();
    if (dir === 'asc') return 'arrow_upward';
    if (dir === 'desc') return 'arrow_downward';
    return 'swap_vert';
  });

  protected onClick() {
    const current = this.sortDirection();
    const next: SortDirection = current === '' ? 'asc' : current === 'asc' ? 'desc' : '';
    this.sortService.sort({ columnId: this.columnId(), direction: next });
  }
}