import {Component, effect, inject, input, Type, ViewContainerRef,} from '@angular/core';

@Component({
  selector: 'table-action-header-cell',
  template: ``,
  standalone: true
})
export class TableActionHeaderCellComponent {
  // Input signals
  renderComponent = input<Type<any>>();

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);

    // Use effect to react to input signal changes
    effect(() => {
      viewContainerRef.clear();
      const component = this.renderComponent();

      if (!component) return;

      viewContainerRef.createComponent(component);
    });
  }
}
