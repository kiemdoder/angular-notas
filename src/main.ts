import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { TablePage } from './app/pages/table/table.page';
import { FormPage } from './app/pages/form/form.page';
import { AppComponent } from './app/app.component';

const appRoutes: Routes = [
  {
    path: 'table',
    component: TablePage,
  },
  {
    path: 'form',
    component: FormPage,
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
  ]
})
  .catch(err => console.error(err));
