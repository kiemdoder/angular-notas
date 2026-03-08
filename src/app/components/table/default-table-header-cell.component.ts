import {Component, signal} from '@angular/core';
import {defaultHeaderValueResolver, TableHeaderCellRenderer} from "./table";
import {AsyncPipe} from "@angular/common";

@Component({
  template: `<span>{{ headerValueResolver()(key()) | async }}</span>`,
  imports: [
    AsyncPipe
  ],
  standalone: true
})
export class DefaultTableHeaderCellComponent implements TableHeaderCellRenderer {
  key = signal('');
  headerValueResolver = signal(defaultHeaderValueResolver);
}
