import {computed, Injectable, signal} from '@angular/core';
import {PageState} from './table';

@Injectable()
export class TablePagingService {
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly activePage = computed<PageState>(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
  }));

  setPage(index: number): void {
    this.pageIndex.set(index);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(0);
  }
}