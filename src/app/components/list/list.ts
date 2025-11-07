import { AfterContentChecked, Component, Directive, TemplateRef, ViewContainerRef, contentChild, input, viewChild } from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

@Directive({
  selector: '[appListTitleDef]',
  standalone: true
})
export class AppListTitleDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}

@Directive({
  selector: '[appListCellDef]',
  standalone: true
})
export class AppListCellDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}

@Directive({
  selector: '[appListCellOutlet]',
  standalone: true
})
export class AppListCellOutlet {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

interface ListContext<T> {
  $implicit: T;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
  imports: [
    NgTemplateOutlet,
    AppListCellOutlet
  ],
  standalone: true
})
export class ListComponent<T = string> implements AfterContentChecked {
  title = input<string>();
  items = input<T[]>([], { alias: 'items' });

  listTitleDef = contentChild(AppListTitleDef<T>);
  listCellDef = contentChild(AppListCellDef<T>);
  private readonly listCellOutlet = viewChild(AppListCellOutlet);
  private readonly defaultCellTemplate = viewChild<TemplateRef<ListContext<T>>>('defaultCellTemplate');

  ngAfterContentChecked(): void {
    this.drawCells();
  }

  private drawCells(): void {
    const outlet = this.listCellOutlet();
    if (!outlet) return;

    const containerRef = outlet.viewContainerRef;
    containerRef.clear();

    const template = this.defaultCellTemplate();
    const cellTemplate = this.listCellDef()?.templateRef ?? template;

    if (!cellTemplate) return;

    for (const item of this.items()) {
      containerRef.createEmbeddedView(cellTemplate, { $implicit: item });
    }
  }
}
