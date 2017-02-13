import {Directive, ElementRef, OnChanges, Input, HostListener} from '@angular/core';

@Directive({
  selector: '[appDragItem]'
})
export class DragItemDirective implements OnChanges{
  @Input() public appDragItem:number;

  @HostListener('dragstart') dragstart() {
    this.el.nativeElement.classList.add("dragged")
  }

  @HostListener('dragend') dragend() {
    this.el.nativeElement.classList.remove("dragged")
  }

  @HostListener('dragover', ['$event']) dragover($event) {
    $event.preventDefault();
    this.el.nativeElement.classList.add("dragovered")
  }

  @HostListener('dragleave') dragleave() {
    this.el.nativeElement.classList.remove("dragovered")
  }

  @HostListener('drop') drop() {
    console.log(this.appDragItem);
    // this.el.nativeElement.classList.remove("dragovered")
  }



  constructor(private el: ElementRef) {}

  ngOnChanges(){

  }

}
