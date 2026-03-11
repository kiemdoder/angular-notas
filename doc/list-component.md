# ListComponent

`src/app/components/list/list.ts`

A generic, fully customisable list component. It renders a title and a list of
items. Both the title block and each cell can be replaced with any template
supplied by the consumer via structural directives. Built-in fallback templates
are used when no custom templates are provided.

---

## Angular Features at a Glance

| Feature | Where it appears |
|---|---|
| `input()` signals | `title`, `items` inputs on `ListComponent` |
| `contentChild()` signal | Queries consumer-projected `AppListTitleDef` / `AppListCellDef` |
| `viewChild()` signal | Queries the outlet and the default cell template inside the component's own view |
| Structural directives | `AppListTitleDef`, `AppListCellDef` — let the consumer supply `<ng-template>` content declaratively |
| `TemplateRef` | Holds a reference to an `<ng-template>` for deferred rendering |
| `ViewContainerRef` | Insertion point used to stamp embedded views at runtime |
| `createEmbeddedView()` | Programmatically renders one view per item |
| `*ngTemplateOutlet` | Declaratively renders the title template (with context) in `list.html` |
| `AfterContentChecked` | Re-renders cells whenever projected content or inputs change |
| Generic component `<T>` | Lets TypeScript infer the item type from the `[items]` binding |

---

## Building Blocks

### 1. `ListContext<T>` — template context shape

```typescript
interface ListContext<T> {
  $implicit: T;
}
```

`$implicit` is Angular's convention for the "default" context variable. When a
template declares `let-foo` without an explicit binding, Angular assigns it the
value of `$implicit`:

```html
<!-- `item` receives context.$implicit, which is the T value for that row -->
<h3 *appListCellDef="let item">{{ item }}</h3>
```

Both title and cell templates receive a `ListContext<T>` object as their context.

---

### 2. `AppListTitleDef<T>` — custom title template directive

```typescript
@Directive({ selector: '[appListTitleDef]', standalone: true })
export class AppListTitleDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}
```

Placed on an element inside `<app-list>`, this directive marks that element as
the custom title template.

**How structural directive de-sugaring works:**

```html
<!-- Consumer writes (shorthand syntax): -->
<h1 *appListTitleDef="let title">{{ title }}</h1>

<!-- Angular de-sugars this into: -->
<ng-template appListTitleDef let-title>
  <h1>{{ title }}</h1>
</ng-template>
```

Angular sees the `[appListTitleDef]` selector on the `<ng-template>` and creates
an instance of `AppListTitleDef`. Because `TemplateRef` is a DI token,
Angular automatically injects the `<ng-template>`'s ref into the constructor,
making it available as `templateRef`.

---

### 3. `AppListCellDef<T>` — custom cell template directive

```typescript
@Directive({ selector: '[appListCellDef]', standalone: true })
export class AppListCellDef<T> {
  constructor(public templateRef: TemplateRef<ListContext<T>>) {}
}
```

Same pattern as `AppListTitleDef`. The captured `templateRef` is what the
component uses to stamp one embedded view per item.

```html
<!-- Each item in the list will render this template -->
<h3 *appListCellDef="let item"><em>{{ item }}</em></h3>
```

---

### 4. `AppListCellOutlet` — outlet (insertion point) directive

```typescript
@Directive({ selector: '[appListCellOutlet]', standalone: true })
export class AppListCellOutlet {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
```

Applied to `<ng-container appListCellOutlet>` in `list.html`. Angular injects
the `ViewContainerRef` for that host element, which is the physical location in
the DOM where dynamically created cell views will be inserted.

This is different from `ng-content`:

| Approach | How content is placed |
|---|---|
| `ng-content` | Projected content is stamped **once** at the slot's position |
| `ViewContainerRef` + `createEmbeddedView` | The component stamps **N views** imperatively at runtime |

Using `ViewContainerRef` allows the component to render the same template once
per item, which `ng-content` alone cannot do.

---

## `ListComponent<T>` — the component

```
selector: app-list
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `title` | `string \| undefined` | `undefined` | Plain-text title; used by the default title template |
| `items` | `T[]` | `[]` | The array of items to render |

### Querying projected content: `contentChild()`

```typescript
listTitleDef = contentChild(AppListTitleDef<T>);
listCellDef  = contentChild(AppListCellDef<T>);
```

`contentChild()` returns a **signal** that resolves to the first matching
directive found in the component's **projected content** (i.e. children placed
between `<app-list>` opening and closing tags by the consumer).

- If the consumer provides `*appListTitleDef`, `listTitleDef()` is the directive
  instance; otherwise it is `undefined`.
- The `.templateRef` property on the directive is the `<ng-template>` reference
  captured from the consumer's markup.

### Querying the component's own view: `viewChild()`

```typescript
private readonly listCellOutlet     = viewChild(AppListCellOutlet);
private readonly defaultCellTemplate = viewChild<TemplateRef<ListContext<T>>>('defaultCellTemplate');
```

`viewChild()` looks inside the **component's own template** (not at projected
children). Two things are queried:

1. **`AppListCellOutlet`** — the outlet directive instance, giving access to
   its `ViewContainerRef`.
2. **`'defaultCellTemplate'`** — the template reference variable
   `#defaultCellTemplate` defined in `list.html`. The string argument matches
   the `#name` in the template. This is the fallback cell template.

---

## `list.html` — the template

```html
<!-- 1. Title area -->
<ng-container *ngTemplateOutlet="listTitleDef()?.templateRef || defaultTitleTemplate;
                                 context: {$implicit: title()}">
</ng-container>

<!-- 2. Cell outlet — dynamically filled by drawCells() -->
<ng-container appListCellOutlet></ng-container>

<!-- 3. Built-in fallback templates (used when consumer provides nothing) -->
<ng-template #defaultTitleTemplate let-title><h4>{{ title() }}</h4></ng-template>
<ng-template #defaultCellTemplate  let-item><div>{{ item }}</div></ng-template>
```

### Title rendering with `*ngTemplateOutlet`

`*ngTemplateOutlet` is Angular's declarative way to render a `TemplateRef`.

```
template  = listTitleDef()?.templateRef   ← consumer's template (if provided)
          || defaultTitleTemplate          ← built-in fallback (if not)

context   = { $implicit: title() }        ← passes the title string to let-title
```

The consumer's title template gets the `title` input value as `$implicit`, so
`let-title` gives back the same string the consumer originally bound to
`[title]`.

### Cell outlet

`<ng-container appListCellOutlet>` is just a marker. The `AppListCellOutlet`
directive attached to it makes the `ViewContainerRef` available to `drawCells()`.

### Default templates

`#defaultTitleTemplate` and `#defaultCellTemplate` are never rendered by the
template engine directly (they are `<ng-template>` elements). They are only used
programmatically or via `*ngTemplateOutlet` as fallbacks.

---

## `drawCells()` — programmatic view creation

`ngAfterContentChecked` fires after every change-detection pass that checks
projected content.  It delegates to `drawCells()`:

```typescript
private drawCells(): void {
  const outlet = this.listCellOutlet();
  if (!outlet) return;                          // outlet not yet in the DOM

  const containerRef = outlet.viewContainerRef;
  containerRef.clear();                         // 1. destroy all existing views

  const template = this.defaultCellTemplate();
  const cellTemplate = this.listCellDef()?.templateRef ?? template; // 2. pick template

  if (!cellTemplate) return;

  for (const item of this.items()) {
    containerRef.createEmbeddedView(            // 3. stamp one view per item
      cellTemplate,
      { $implicit: item }                       //    bind item to let-foo
    );
  }
}
```

**Step-by-step:**

1. **`containerRef.clear()`** — destroys all previously inserted views. Required
   because `items` or the template may have changed since the last call.

2. **Pick a template** — consumer-supplied (`AppListCellDef.templateRef`) takes
   priority over the built-in `#defaultCellTemplate`.

3. **`createEmbeddedView(template, context)`** — instantiates the template
   inside the container. The second argument is the context object; setting
   `$implicit` makes the item available as `let-item` (or any name) in the template.

### Why `AfterContentChecked` (not `AfterViewInit`)?

- `AfterViewInit` fires only once after the first render — it would miss updates
  when `items` changes later.
- `AfterContentChecked` fires after every check of projected content, ensuring
  the cell list stays in sync with the `items` signal.

---

## Usage Example

```typescript
// list.page.ts
import { Component, signal } from '@angular/core';
import { AppListCellDef, AppListTitleDef, ListComponent } from '../../components/list/list';

@Component({
  template: `
    <app-list [title]="'List One'" [items]="data()">

      <!--
        Custom title template.
        *appListTitleDef de-sugars to <ng-template appListTitleDef let-title>.
        'title' receives the value bound to [title]="'List One'" via $implicit.
      -->
      <h1 *appListTitleDef="let title">{{ title }}</h1>

      <!--
        Custom cell template.
        *appListCellDef de-sugars to <ng-template appListCellDef let-item>.
        'item' receives each element from data() via $implicit.
      -->
      <h3 *appListCellDef="let item"><em>{{ item }}</em></h3>

    </app-list>
  `,
  imports: [
    ListComponent,   // the host component
    AppListTitleDef, // must be imported so Angular recognises the directive
    AppListCellDef,  // same
  ],
  standalone: true
})
export class ListPage {
  // signal() creates a reactive state value; data() reads the current value.
  data = signal(['Alfa', 'Bravo', 'Charlie', 'Delta', 'Foxtrot']);
}
```

### Without custom templates (defaults)

```html
<!-- Uses the built-in <h4> title and <div> cell templates -->
<app-list [title]="'Simple List'" [items]="['one', 'two', 'three']"></app-list>
```

---

## Summary of Key Patterns

```
Consumer template                    ListComponent internals
─────────────────────────────        ─────────────────────────────────────────
*appListTitleDef="let title"   →     contentChild(AppListTitleDef)
                                     → TemplateRef captured, used by *ngTemplateOutlet

*appListCellDef="let item"     →     contentChild(AppListCellDef)
                                     → TemplateRef captured, used in drawCells()

[title]="..."                  →     input<string>()
[items]="..."                  →     input<T[]>()

<ng-container appListCellOutlet> →   viewChild(AppListCellOutlet)
                                     → ViewContainerRef, insertion point for cells

#defaultCellTemplate            →   viewChild('defaultCellTemplate')
                                     → fallback TemplateRef
```