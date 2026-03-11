import { AfterContentChecked, Component, Directive, TemplateRef, ViewContainerRef, contentChild, input, viewChild } from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

/**
 * Structural directive that marks a custom title template inside <app-list>.
 *
 * The `[appListTitleDef]` selector means it is applied as an attribute, typically
 * with the structural-directive shorthand `*appListTitleDef="let title"`.
 *
 * Angular de-sugars that shorthand into:
 *   <ng-template appListTitleDef let-title="$implicit"> ... </ng-template>
 *
 * Angular injects the TemplateRef of that <ng-template> automatically via DI,
 * making it available as `templateRef` for the parent component to consume.
 *
 * The generic parameter <T> matches the item type of the parent ListComponent
 * so that the template variable `let-title` is correctly typed.
 */
@Directive({
  selector: '[appListTitleDef]',
  standalone: true
})
export class AppListTitleDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}

/**
 * Structural directive that marks a custom cell template inside <app-list>.
 *
 * Usage:  *appListCellDef="let item"
 *
 * Angular de-sugars that into:
 *   <ng-template appListCellDef let-item="$implicit"> ... </ng-template>
 *
 * The parent component queries for this directive via contentChild() and uses
 * the captured TemplateRef to imperatively render one embedded view per item.
 */
@Directive({
  selector: '[appListCellDef]',
  standalone: true
})
export class AppListCellDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}

/**
 * Outlet directive that marks the DOM location where cells will be inserted.
 *
 * Applied to <ng-container appListCellOutlet> in list.html.
 * Angular injects a ViewContainerRef for that host element, which the parent
 * component uses as the insertion point when calling createEmbeddedView().
 *
 * Unlike ng-content (which stamps projected content once at the slot's position),
 * this approach lets the component programmatically stamp N views at runtime —
 * one per item in the list.
 */
@Directive({
  selector: '[appListCellOutlet]',
  standalone: true
})
export class AppListCellOutlet {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

/**
 * Template context passed to both the title and cell templates.
 *
 * `$implicit` is Angular's convention for the "default" context variable.
 * When a template declares `let-foo` (with no explicit binding), Angular binds
 * it to `$implicit`.  So:
 *
 *   *appListCellDef="let item"   →  item === context.$implicit === the T value
 */
interface ListContext<T> {
  $implicit: T;
}

/**
 * A generic, customisable list component.
 *
 * Renders a title and a list of items.  Both the title and each cell can be
 * replaced with arbitrary templates supplied by the consumer via structural
 * directives.  When no custom templates are provided, built-in fallbacks
 * defined in list.html are used.
 *
 * ## Angular features used
 *
 * | Feature                  | Purpose                                                  |
 * |--------------------------|----------------------------------------------------------|
 * | `input()` signals        | Declare reactive inputs (title, items)                   |
 * | `contentChild()` signal  | Query projected directive instances from consumer markup |
 * | `viewChild()` signal     | Query elements/directives in the component's own view    |
 * | Structural directives    | Let consumers supply <ng-template> content declaratively |
 * | `TemplateRef`            | Hold a reference to an <ng-template> for later use       |
 * | `ViewContainerRef`       | Insertion point; used to stamp embedded views at runtime |
 * | `createEmbeddedView()`   | Programmatically render one view per item                |
 * | `*ngTemplateOutlet`      | Declaratively render the title template in the HTML      |
 * | `AfterContentChecked`    | Re-render cells whenever projected content changes       |
 *
 * ## Generic parameter
 * T defaults to `string`.  Consumer can override:
 *   <app-list [items]="myObjects">  (TS infers T from the items binding)
 */
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

  /**
   * Optional plain-text title passed as a simple string input.
   * Exposed to the default title template via the *ngTemplateOutlet context.
   * Ignored when a custom *appListTitleDef template is provided.
   */
  title = input<string>();

  /**
   * The array of items to render.
   * Defaults to an empty array so the component is safe before data arrives.
   * The alias `'items'` means the binding in templates is [items]="..." which
   * matches the property name — the alias is redundant here but makes the
   * intent explicit.
   */
  items = input<T[]>([], { alias: 'items' });

  /**
   * Queries the consumer's projected content for an AppListTitleDef directive.
   * Returns a signal that resolves to the directive instance (or undefined).
   *
   * contentChild() watches content projection — i.e. children placed between
   * the component's opening and closing tags by the consumer.
   *
   * Used in list.html to pick between the custom template and the fallback:
   *   listTitleDef()?.templateRef || defaultTitleTemplate
   */
  listTitleDef = contentChild(AppListTitleDef<T>);

  /**
   * Queries projected content for an AppListCellDef directive.
   * If present, its templateRef is used instead of the built-in cell template.
   */
  listCellDef = contentChild(AppListCellDef<T>);

  /**
   * Queries the component's own view for the AppListCellOutlet directive.
   * viewChild() (vs contentChild) looks inside the component's own template,
   * not at projected children.
   *
   * This gives access to the ViewContainerRef attached to the outlet element,
   * which is the insertion point for all dynamically created cell views.
   */
  private readonly listCellOutlet = viewChild(AppListCellOutlet);

  /**
   * Queries the component's own view for the <ng-template #defaultCellTemplate>
   * reference defined in list.html.
   *
   * The string `'defaultCellTemplate'` matches the template reference variable
   * `#defaultCellTemplate` in the HTML.  This acts as the fallback cell
   * renderer when no *appListCellDef is projected by the consumer.
   */
  private readonly defaultCellTemplate = viewChild<TemplateRef<ListContext<T>>>('defaultCellTemplate');

  /**
   * AfterContentChecked fires after Angular has checked the projected content
   * on every change detection cycle.  This is the right hook here because:
   *
   * - The projected directives (AppListTitleDef, AppListCellDef) live in the
   *   consumer's template and are only fully initialised after content is checked.
   * - Using AfterViewInit alone would miss updates when `items` changes after
   *   the initial render.
   *
   * The trade-off: this fires often.  drawCells() is cheap (it only rebuilds
   * when actually called), but a production component might add a dirty-check
   * or use a signal effect() to reduce unnecessary work.
   */
  ngAfterContentChecked(): void {
    this.drawCells();
  }

  /**
   * Imperatively renders one embedded view per item into the outlet container.
   *
   * Steps:
   * 1. Resolve the outlet — the <ng-container appListCellOutlet> in list.html.
   *    If it doesn't exist yet, bail out early.
   * 2. Clear all previously rendered views.  This is necessary on every call
   *    because the items array or the cell template may have changed.
   * 3. Decide which template to use: the consumer-supplied one (from
   *    AppListCellDef) takes priority; otherwise fall back to the built-in
   *    #defaultCellTemplate defined in list.html.
   * 4. Loop over items and call createEmbeddedView() for each one, passing
   *    the item as `$implicit` in the context object so the template can bind
   *    to it via `let-item`.
   */
  private drawCells(): void {
    const outlet = this.listCellOutlet();
    if (!outlet) return;                          // outlet not yet in the DOM

    const containerRef = outlet.viewContainerRef;
    containerRef.clear();                         // destroy all existing views

    const template = this.defaultCellTemplate();
    // Prefer the consumer-supplied template; fall back to the built-in default.
    const cellTemplate = this.listCellDef()?.templateRef ?? template;

    if (!cellTemplate) return;                    // no template available yet

    for (const item of this.items()) {
      // Creates a live view from the template and attaches it to the container.
      // { $implicit: item } populates the `let-item` variable in the template.
      containerRef.createEmbeddedView(cellTemplate, { $implicit: item });
    }
  }
}