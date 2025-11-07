import {Component, signal} from '@angular/core';
import {ListComponent} from "../../components/list/list";

@Component({
  template: `
    <app-list [title]="'List One'" [items]="data()"></app-list>
  `,
  imports: [
    ListComponent
  ],
  standalone: true
})
export class ListPage {
  data = signal(['Alfa', 'Bravo', 'Charlie', 'Delta', 'Foxtrot'])
}
