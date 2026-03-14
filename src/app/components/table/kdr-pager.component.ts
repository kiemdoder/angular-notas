import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {TablePagingService} from './table-paging.service';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'kdr-pager',
  standalone: true,
  imports: [MatIconButton, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kdr-pager">
      <span class="page-size-label">Rows per page:</span>
      <select class="page-size-select" (change)="onPageSizeChange($event)">
        @for (size of pageSizes; track size) {
          <option [value]="size" [selected]="size === pagingService.pageSize()">{{ size }}</option>
        }
      </select>
      <span class="range-label">{{ rangeLabel() }}</span>
      <button mat-icon-button [disabled]="pagingService.pageIndex() === 0" (click)="prevPage()" aria-label="Previous page">
        <mat-icon>chevron_left</mat-icon>
      </button>
      <button mat-icon-button [disabled]="isLastPage()" (click)="nextPage()" aria-label="Next page">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .kdr-pager {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 4px;
      font-size: 14px;
    }
    .page-size-label {
      color: rgba(0, 0, 0, 0.6);
    }
    .page-size-select {
      border: none;
      background: transparent;
      font-size: 14px;
      cursor: pointer;
    }
    .range-label {
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.6);
    }
  `],
})
export class KdrPagerComponent {
  totalItems = input<number>(0);
  readonly pageSizes = [5, 10, 25, 50];

  protected pagingService = inject(TablePagingService);

  rangeLabel = computed(() => {
    const start = this.pagingService.pageIndex() * this.pagingService.pageSize() + 1;
    const end = Math.min(start + this.pagingService.pageSize() - 1, this.totalItems());
    return `${start}–${end} of ${this.totalItems()}`;
  });

  isLastPage = computed(() =>
    (this.pagingService.pageIndex() + 1) * this.pagingService.pageSize() >= this.totalItems()
  );

  prevPage(): void {
    this.pagingService.setPage(this.pagingService.pageIndex() - 1);
  }

  nextPage(): void {
    this.pagingService.setPage(this.pagingService.pageIndex() + 1);
  }

  onPageSizeChange(event: Event): void {
    this.pagingService.setPageSize(Number((event.target as HTMLSelectElement).value));
  }
}