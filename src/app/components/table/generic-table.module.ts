import { NgModule } from '@angular/core';
import { TableCellComponent } from './table-cell.component';
import { GenericTableComponent } from './generic-table.component';
import { MatTableModule } from '@angular/material/table';
import { TextTableCellComponent } from './text-table-cell.component';
import { CommonModule } from '@angular/common';

const componentExports = [GenericTableComponent];

@NgModule({
  declarations: [
    TableCellComponent,
    TextTableCellComponent,
    ...componentExports,
  ],
  imports: [CommonModule, MatTableModule],
  exports: [...componentExports],
})
export class GenericTableModule {}
