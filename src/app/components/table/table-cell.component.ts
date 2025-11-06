import {Component, effect, inject, input, Type, ViewContainerRef,} from '@angular/core';
import {TextTableCellComponent} from './text-table-cell.component';
import {TableCellRenderer} from './table';

@Component({
    selector: 'table-cell',
    template: ``,
    standalone: true
})
export class TableCellComponent {
  // Input signals
  row = input<any>({});
  field = input<string>('');
  renderComponent = input<Type<TableCellRenderer>>(TextTableCellComponent);

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    // Use effect to react to input signal changes
    effect(() => {
      viewContainerRef.clear();
      const compRef = viewContainerRef.createComponent<TableCellRenderer>(
        this.renderComponent()
      );

      compRef.instance.row.set(this.row());
      compRef.instance.field.set(this.field());
    });
  }
}
