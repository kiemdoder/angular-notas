import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { TablePage } from './app/pages/table/table.page';
import { FormPage } from './app/pages/form/form.page';
import { AppComponent } from './app/app.component';
import {ListPage} from "./app/pages/list/list.page";

const appRoutes: Routes = [
  {
    path: 'table',
    component: TablePage,
  },
  {
    path: 'form',
    component: FormPage,
  },
  {
    path: 'list',
    component: ListPage,
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
  ]
})
  .catch(err => console.error(err));
