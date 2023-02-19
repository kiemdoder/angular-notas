import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { TablePageComponent } from './pages/table/tablePage.component';
import { RouterModule, Routes } from '@angular/router';
import { GenericTableModule } from './components/table/generic-table.module';

const matImports = [MatSidenavModule, MatButtonModule];
const appModules = [GenericTableModule];
const pages = [TablePageComponent];

const appRoutes: Routes = [
  {
    path: 'table',
    component: TablePageComponent,
  },
];

@NgModule({
  declarations: [AppComponent, ...pages],
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
