import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragItem]'
})
export class DragItemDirective {
  @Input() public appDragItem: [number, Array<any>];
  @Output() onDrop = new EventEmitter();
  public shift_down = false;
  @HostBinding('draggable') draggable = true;

  constructor(private el: ElementRef) {
  }


  @HostListener('dragstart', ['$event'])
  dragstart($event: DragEvent) {
    let dragIndex: string = this.appDragItem[0].toString();
    $event.dataTransfer.setData('dragIndex', dragIndex);
    this.el.nativeElement.classList.add('dragged');
  }

  @HostListener('dragend')
  dragend() {
    this.el.nativeElement.classList.remove('dragged');
  }

  @HostListener('dragover', ['$event'])
  dragover($event) {
    $event.preventDefault();
    this.el.nativeElement.classList.add('dragovered');
  }

  @HostListener('dragleave')
  dragleave() {
    this.el.nativeElement.classList.remove('dragovered');
  }


  @HostListener('drop', ['$event'])
  drop($event: DragEvent) {
    let dropIndex = this.appDragItem[0];
    let dragIndex: number = +$event.dataTransfer.getData('dragIndex');
    let array = this.appDragItem[1];
    this.el.nativeElement.classList.remove('dragovered');

    if (dropIndex !== dragIndex) {
      let temp = array[dragIndex];
      array[dragIndex] = array[dropIndex];
      array[dropIndex] = temp;
      this.onDrop.emit(array);
    }
  }

  @HostListener('keyup', ['$event'])
  keyup($event) {
    switch ($event.which) {
      case 16:
        this.shift_down = false;
        break;
    }
  }

  @HostListener('keydown', ['$event'])
  keydown($event) {
    switch ($event.which) {
      case 38:
        this.keydownDown();
        break;
      case 40:
        this.keydownUp();
        break;
      case 16:
        this.shift_down = true;
        break;
    }
  }

  keydownDown() {
    if (this.shift_down) {
      this.switchNext();
    } else {
      this.focusNext();
    }
  }

  keydownUp() {
    if (this.shift_down) {
      this.switchPrev();
    } else {
      this.focusPrev();
    }
  }

  switchNext() {
    let dropIndex = this.appDragItem[0];
    let array = this.appDragItem[1];
    let swapIndex, temp;
    swapIndex = (dropIndex + 1) % array.length;
    temp = array[dropIndex];
    array[dropIndex] = array[swapIndex];
    array[swapIndex] = temp;
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0);
  }

  switchPrev() {
    let dropIndex = this.appDragItem[0];
    let array = this.appDragItem[1];
    let swapIndex, temp;
    swapIndex = (dropIndex - 1) % array.length;
    if (swapIndex < 0) {
      swapIndex += array.length;
    }
    temp = array[dropIndex];
    array[dropIndex] = array[swapIndex];
    array[swapIndex] = temp;
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0);
  }

  focusNext() {
    let elem: HTMLElement = this.el.nativeElement;
    let brothers: HTMLCollection = elem.parentElement.children;
    let array = [].slice.call(brothers);
    let myindex = array.indexOf(this.el.nativeElement);
    let prev_index = (myindex - 1) < 0 ? array.length + (myindex - 1) : (myindex - 1);
    array[prev_index].focus();
  }

  focusPrev() {
    let elem: HTMLElement = this.el.nativeElement;
    let brothers: HTMLCollection = elem.parentElement.children;
    let array = [].slice.call(brothers);
    let myindex = array.indexOf(this.el.nativeElement);
    let next_index = (myindex + 1) % array.length;
    array[next_index].focus();
  }

}
