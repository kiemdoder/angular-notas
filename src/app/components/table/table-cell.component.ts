import {
  Component,
  effect,
  input,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { TextTableCellComponent } from './text-table-cell.component';
import { TableCellRenderer, TableCellRendererSignal, isSignalRenderer } from './table';

@Component({
    selector: 'table-cell',
    template: ``
})
export class TableCellComponent {
  // Input signals
  row = input<any>({});
  field = input<string>('');
  renderComponent = input<Type<TableCellRenderer | TableCellRendererSignal>>(TextTableCellComponent);

  constructor(private viewContainerRef: ViewContainerRef) {
    // Use effect to react to input signal changes
    effect(() => {
      this.viewContainerRef.clear();
      const compRef = this.viewContainerRef.createComponent<TableCellRenderer | TableCellRendererSignal>(
        this.renderComponent()
      );

      // Check if the renderer uses signals or legacy interface
      if (isSignalRenderer(compRef.instance)) {
        // Signal-based renderer - use .set()
        compRef.instance.row.set(this.row());
        compRef.instance.field.set(this.field());
      } else {
        // Legacy renderer - direct assignment
        compRef.instance.row = this.row();
        compRef.instance.field = this.field();
      }
    });
  }
}
