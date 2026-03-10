import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {SortDirection} from './table';

@Component({
  selector: 'kdr-sort-header',
  template: `
    <button (click)="onClick()">
      <mat-icon>{{ icon() }}</mat-icon>
    </button>
  `,
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KdrSortHeaderComponent {
  direction = input<SortDirection>('');
  sortChange = output<SortDirection>();

  protected icon() {
    const dir = this.direction();
    if (dir === 'asc') return 'arrow_upward';
    if (dir === 'desc') return 'arrow_downward';
    return 'swap_vert';
  }

  protected onClick() {
    const next: SortDirection =
      this.direction() === '' ? 'asc' :
      this.direction() === 'asc' ? 'desc' : '';
    this.sortChange.emit(next);
  }
}