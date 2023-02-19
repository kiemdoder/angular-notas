import {
  Component,
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { TextTableCellComponent } from './text-table-cell.component';
import { TableCellRenderer } from './table';

@Directive({
  selector: '[cellContentOutlet]',
})
export class CellOutlet {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'table-cell',
  template: ``,
})
export class TableCellComponent implements OnInit {
  @Input() row = {};
  @Input() field = '';
  renderComponent: Type<TableCellRenderer> = TextTableCellComponent;
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    this.viewContainerRef.clear();
    const compRef = this.viewContainerRef.createComponent<TableCellRenderer>(
      this.renderComponent
    );
    compRef.instance.row = this.row;
    compRef.instance.field = this.field;
  }
}
