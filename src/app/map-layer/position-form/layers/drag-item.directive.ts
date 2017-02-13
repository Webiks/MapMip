import {Directive, ElementRef, OnChanges, Input, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appDragItem]'
})
export class DragItemDirective{

  constructor(private el: ElementRef) {}

  @Input("appDragItem") public data:[number,Array<any>];
  @Output() onDrop = new EventEmitter();

  @HostListener('dragstart', ['$event']) dragstart($event:DragEvent) {
    let dragIndex:string = this.data[0].toString();
    $event.dataTransfer.setData("dragIndex", dragIndex);
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

  @HostListener('drop', ['$event']) drop($event:DragEvent) {
    let dropIndex = this.data[0];
    let dragIndex:number = +$event.dataTransfer.getData("dragIndex");
    let array = this.data[1];
    this.el.nativeElement.classList.remove("dragovered");
    if(dropIndex != dragIndex){
      let temp = array[dragIndex];
      array[dragIndex] = array[dropIndex];
      array[dropIndex] = temp;
      this.onDrop.emit();
    }
  }

}
