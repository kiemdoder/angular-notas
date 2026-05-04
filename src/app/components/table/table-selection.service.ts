import {Injectable, Signal, computed, signal} from "@angular/core";

/**
 * Service for managing row selection state in a table.
 * Maintains a set of selected row IDs and provides methods for selection operations.
 * It is very important to define a provider for this service in the component where the component is used
 * to ensure that each table instance has its own selection state. If the service is provided at a higher level (e.g., root),
 * all tables will share the same selection state, which can lead to unintended consequences.
 */
@Injectable()
export class TableSelectionService {
  private readonly _selectedRowIds = signal(new Set<string>());

  // Read-only — consumers watch this but cannot mutate it directly
  public readonly selectedRowIds: Signal<ReadonlySet<string>> = computed(() => this._selectedRowIds());

  /**
   * Adds a row to the selection.
   * If the row is already selected, this operation has no effect.
   */
  public selectRow(id: string): void {
    this._selectedRowIds.update(s => new Set([...s, id]));
  }

  /**
   * Removes a row from the selection.
   * If the row is not selected, this operation has no effect.
   */
  public deselectRow(id: string): void {
    this._selectedRowIds.update(s => { const n = new Set(s); n.delete(id); return n; });
  }

  /**
   * Clears all row selections, resetting the selection state to empty.
   */
  public clearSelection(): void {
    this._selectedRowIds.set(new Set());
  }
}
