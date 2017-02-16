import {Directive, ElementRef,HostBinding, Input, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appDragItem]'
})
export class DragItemDirective{

  constructor(private el: ElementRef) {}

  @Input("appDragItem") public data:[number,Array<any>];
  @Output() onDrop = new EventEmitter();
  public shift_down:boolean = false;

  @HostListener('dragstart', ['$event']) dragstart($event:DragEvent) {
    let dragIndex:string = this.data[0].toString();
    $event.dataTransfer.setData("dragIndex", dragIndex);
    this.el.nativeElement.classList.add("dragged")
  }

  @HostBinding('draggable') draggable = true;

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
      this.onDrop.emit(array);
    }
  }




  @HostListener('keyup', ['$event']) keyup($event){
    switch ($event.which) {
     case 16:
        this.shift_down = false;
        break;
    }
  }

  @HostListener('keydown', ['$event']) keydown($event){
    let dropIndex = this.data[0];
    let array = this.data[1];
    let swapIndex, temp;

    switch ($event.which) {
      case 38:
        if(this.shift_down) {
          swapIndex = (dropIndex + 1) % array.length;
          temp = array[dropIndex];
          array[dropIndex] = array[swapIndex];
          array[swapIndex] = temp;
          setTimeout(()=>{
            this.el.nativeElement.focus();
          }, 0);
        } else {
          let elem:HTMLElement = this.el.nativeElement;
          let brothers:HTMLCollection = elem.parentElement.children;
          let array = [].slice.call(brothers);
          let myindex = array.indexOf(this.el.nativeElement);
          let prev_index = (myindex - 1) < 0 ? array.length + (myindex - 1) : (myindex - 1);
          array[prev_index ].focus();
        }
        break;
      case 40:
        if(this.shift_down) {
          swapIndex = (dropIndex - 1) % array.length;
          if (swapIndex < 0) swapIndex += array.length;
          temp = array[dropIndex];
          array[dropIndex] = array[swapIndex];
          array[swapIndex] = temp;
          setTimeout(()=>{
            this.el.nativeElement.focus();
          }, 0);
        } else {
          let elem:HTMLElement = this.el.nativeElement;
          let brothers:HTMLCollection = elem.parentElement.children;
          let array = [].slice.call(brothers);
          let myindex = array.indexOf(this.el.nativeElement);
          let next_index = (myindex + 1) % array.length;
          array[next_index].focus();
        }
        break;
      case 16:
        this.shift_down = true;
        break;
    }
  }

}
