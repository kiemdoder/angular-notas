import {Component, effect, inject, input, signal, Type, ViewContainerRef,} from '@angular/core';
import {defaultHeaderValueResolver, HeaderValueResolver, TableHeaderCellRenderer} from './table';
import {DefaultTableHeaderCellComponent} from "./default-table-header-cell.component";

@Component({
  selector: 'table-header-cell',
  template: ``,
  standalone: true
})
export class TableHeaderCellComponent {
  // Input signals
  headerKey = input<string>('');
  headerValueResolver = input<HeaderValueResolver>(defaultHeaderValueResolver);
  renderComponent = input<Type<TableHeaderCellRenderer>>(DefaultTableHeaderCellComponent);

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    // Use effect to react to input signal changes
    effect(() => {
      viewContainerRef.clear();
      const compRef = viewContainerRef.createComponent<TableHeaderCellRenderer>(
        this.renderComponent()
      );

      compRef.instance.key.set(this.headerKey());
      if (compRef.instance.headerValueResolver) {
        compRef.instance.headerValueResolver.set(this.headerValueResolver());
      }
    });
  }
}
