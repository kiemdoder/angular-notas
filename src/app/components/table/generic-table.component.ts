import { Component, Input, OnInit } from '@angular/core';
import { splitFieldName } from '../../../utils/format';
import { ColumnDefs } from './table';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() excludedColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefs = {};
  cols: string[] = [];

  ngOnInit(): void {
    if (this.displayedColumns.length > 0) {
      this.cols = this.displayedColumns;
    } else {
      const colsFromData =
        this.data && this.data.length > 0 ? Object.keys(this.data[0]) : [];
      this.cols = colsFromData.filter(
        (col) => this.excludedColumns.indexOf(col) === -1
      );
    }
  }

  splitFieldName_(col: string) {
    return splitFieldName(col);
  }
}
