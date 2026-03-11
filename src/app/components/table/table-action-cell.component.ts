import {Component, effect, inject, input, Type, ViewContainerRef,} from '@angular/core';
import {TableActionCellRenderer} from './table';

@Component({
  selector: 'table-action-cell',
  template: ``,
  standalone: true
})
export class TableActionCellComponent {
  // Input signals
  row = input<any>({});
  rowIdField = input<string>('');
  renderComponent = input<Type<TableActionCellRenderer>>();

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    // Use effect to react to input signal changes
    effect(() => {
      viewContainerRef.clear();
      const component = this.renderComponent();

      if (!component) return;

      const compRef = viewContainerRef.createComponent<TableActionCellRenderer>(component);

      compRef.instance.row.set(this.row());
      compRef.instance.rowIdField.set(this.rowIdField());
    });
  }
}
