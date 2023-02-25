import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { TablePage } from './pages/table/table.page';
import { RouterModule, Routes } from '@angular/router';
import { GenericTableModule } from './components/table/generic-table.module';
import { WeightCellComponent } from './pages/table/weight-cell.component';

const matImports = [MatSidenavModule, MatButtonModule];
const appModules = [GenericTableModule];
const pages = [TablePage];
const components = [WeightCellComponent];

const appRoutes: Routes = [
  {
    path: 'table',
    component: TablePage,
  },
];

@NgModule({
  declarations: [AppComponent, ...pages, ...components],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    ...appModules,
    ...matImports,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
