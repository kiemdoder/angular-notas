import { Component, signal } from '@angular/core';
import { MatDrawerContainer, MatDrawer } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, RouterLink, RouterLinkActive, RouterOutlet],
    standalone: true
})
export class AppComponent {
  title = signal('angular-notas');
}
