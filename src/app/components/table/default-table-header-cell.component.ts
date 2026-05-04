import {Component, signal} from '@angular/core';
import {defaultHeaderValueResolver, TableHeaderCellRenderer} from "./table";
import {AsyncPipe} from "@angular/common";

@Component({
  template: `<span>{{ headerValueResolver()(headerNameKey()) | async }}</span>`,
  imports: [
    AsyncPipe
  ],
  standalone: true
})
export class DefaultTableHeaderCellComponent implements TableHeaderCellRenderer {
  headerNameKey = signal('');
  headerValueResolver = signal(defaultHeaderValueResolver);
}
