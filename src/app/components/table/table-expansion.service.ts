import {computed, Injectable, Signal, signal} from '@angular/core';

@Injectable()
export class TableExpansionService {
  private readonly _expandedRowIds = signal(new Set<string>());

  readonly expandedRowIds: Signal<ReadonlySet<string>> = computed(() => this._expandedRowIds());

  expandRow(id: string): void {
    this._expandedRowIds.update(s => new Set([...s, id]));
  }

  collapseRow(id: string): void {
    this._expandedRowIds.update(s => { const n = new Set(s); n.delete(id); return n; });
  }

  toggleRow(id: string): void {
    this._expandedRowIds.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  clearExpansion(): void {
    this._expandedRowIds.set(new Set());
  }
}