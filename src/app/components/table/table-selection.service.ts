import {Injectable, Signal, computed, signal} from "@angular/core";

@Injectable()
export class TableSelectionService {
  private readonly _selectedRowIds = signal(new Set<string>());

  // Read-only — consumers watch this but cannot mutate it directly
  public readonly selectedRowIds: Signal<ReadonlySet<string>> = computed(() => this._selectedRowIds());

  public selectRow(id: string): void {
    this._selectedRowIds.update(s => new Set([...s, id]));
  }

  public deselectRow(id: string): void {
    this._selectedRowIds.update(s => { const n = new Set(s); n.delete(id); return n; });
  }

  public clearSelection(): void {
    this._selectedRowIds.set(new Set());
  }
}
