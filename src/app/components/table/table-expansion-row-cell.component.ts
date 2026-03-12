import {Component, effect, inject, input, Type, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'table-expansion-row-cell',
  template: ``,
  standalone: true
})
export class TableExpansionRowCellComponent {
  row = input<any>({});
  renderComponent = input<Type<any>>();

  constructor() {
    const viewContainerRef = inject(ViewContainerRef);
    effect(() => {
      viewContainerRef.clear();
      const component = this.renderComponent();
      if (!component) return;
      const compRef = viewContainerRef.createComponent(component);
      compRef.instance.row.set(this.row());
    });
  }
}