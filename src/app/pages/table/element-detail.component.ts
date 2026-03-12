import {Component, signal} from '@angular/core';
import {Row} from '../../components/table/table';

@Component({
  template: `<div class="element-detail">{{ $any(row()).description }}</div>`,
  standalone: true
})
export class ElementDetailComponent {
  row = signal<Row>({});
}