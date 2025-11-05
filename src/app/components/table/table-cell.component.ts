import {
  Component,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { TextTableCellComponent } from './text-table-cell.component';
import { TableCellRenderer } from './table';

@Component({
    selector: 'table-cell',
    template: ``,
    standalone: false
})
export class TableCellComponent implements OnInit {
  @Input() row = {};
  @Input() field = '';
  @Input() renderComponent: Type<TableCellRenderer> = TextTableCellComponent;
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
