import {Component, signal} from '@angular/core';
import {ArrayTableDataSource, ColumnDefs, HeaderValueResolver} from '../../components/table/table';
import {WeightCellComponent} from './weight-cell.component';
import {KdrTableComponent} from "../../components/table/kdr-table.component";
import {of} from "rxjs";

interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const headerCellResolver: HeaderValueResolver = (headerKey: string) =>
  of({
    'position.header': 'No.',
    'name.header': 'Element Name',
    'symbol.header': 'Symbol',
  }[headerKey] || headerKey);

@Component({
  template: `
    <kdr-table
      [dataSource]="dataSource()"
      [displayedColumns]="['position', 'name', 'weight', 'symbol']"
      [headerValueResolver]="headerCellResolver"
      [columnDefinitions]="columnDefinitions()"
    ></kdr-table>
  `,
  imports: [KdrTableComponent],
  standalone: true
})
export class KdrTablePage {
  dataSource = signal(new ArrayTableDataSource(ELEMENT_DATA));
  // columns = ['name', 'position', 'weight', 'symbol'];
  columns = signal<string[]>([]);
  columnDefinitions = signal<ColumnDefs>([
    {
      id: 'position',
      headerKey: 'position.header',
    },
    {
      id: 'name',
      headerKey: 'name.header',
    },
    {
      id: 'symbol',
      headerKey: 'symbol.header',
    },
    {
      id: 'weight',
      headerKey: 'Atomic weight',
      cellRenderComponent: WeightCellComponent,
    },
  ]);
  protected readonly headerCellResolver = headerCellResolver;
}
