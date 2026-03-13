import {AfterViewInit, Directive, ElementRef, OnDestroy, output, Renderer2} from '@angular/core';

@Directive({
  selector: 'th[kdrResizable]',
  standalone: true,
  host: {'style': 'position: relative; overflow: visible;'}
})
export class KdrResizableDirective implements AfterViewInit, OnDestroy {
  widthChange = output<number>();

  private handle!: HTMLDivElement;
  private startX = 0;
  private startWidth = 0;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.handle = this.renderer.createElement('div');
    this.renderer.setStyle(this.handle, 'position', 'absolute');
    this.renderer.setStyle(this.handle, 'right', '-2px');
    this.renderer.setStyle(this.handle, 'top', '0');
    this.renderer.setStyle(this.handle, 'bottom', '0');
    this.renderer.setStyle(this.handle, 'width', '4px');
    this.renderer.setStyle(this.handle, 'cursor', 'col-resize');
    this.renderer.setStyle(this.handle, 'z-index', '10');
    this.renderer.setStyle(this.handle, 'user-select', 'none');
    this.renderer.appendChild(this.el.nativeElement, this.handle);
    this.handle.addEventListener('mousedown', this.onMouseDown);
  }

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.startX = e.clientX;
    this.startWidth = this.el.nativeElement.offsetWidth;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    const newWidth = Math.max(40, this.startWidth + (e.clientX - this.startX));
    this.widthChange.emit(newWidth);
  };

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}