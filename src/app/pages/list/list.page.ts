import {Component, signal} from '@angular/core';
import {AppListCellDef, AppListTitleDef, ListComponent} from "../../components/list/list";

@Component({
  template: `
    <app-list [title]="'List One'" [items]="data()">
      <h1 *appListTitleDef="let title">{{title}}</h1>
      <h3 *appListCellDef="let item"><em>{{item}}</em></h3>
    </app-list>
  `,
  imports: [
    ListComponent,
    AppListTitleDef,
    AppListCellDef
  ],
  standalone: true
})
export class ListPage {
  data = signal(['Alfa', 'Bravo', 'Charlie', 'Delta', 'Foxtrot'])
}
