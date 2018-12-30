import { DragItemDirective } from './drag-item.directive';
import { ElementRef } from '@angular/core';

describe('DragItemDirective', () => {
  let el: ElementRef;
  let dragItemDirective: DragItemDirective;

  beforeEach(() => {
    el = <any>{ nativeElement: {} };


    class Elem {
      focus: () => void = () => {
      };
    }

    let elem1 = new Elem();
    let elem2 = new Elem();
    let elem3 = new Elem();
    let children = [elem1, elem2, elem3];
    el.nativeElement = {
      parentElement: { children },
      focus: (): void => {
      },
      classList: {
        remove: () => {
        },
        add: () => {
        }
      }
    };

    dragItemDirective = new DragItemDirective(el);
  });

  it('should create an instance', () => {
    expect(dragItemDirective).toBeDefined();
  });

  it('dragstart should set dragIndex (input data[0]) in dataTransfer and add class "dragged" to element', () => {
    let $event: DragEvent = <any>{
      dataTransfer: {
        setData: (key, val): void => {
        }
      }
    };
    dragItemDirective.appDragItem = [10, []];
    spyOn($event.dataTransfer, 'setData');
    spyOn(el.nativeElement.classList, 'add');

    dragItemDirective.dragstart($event);
    expect($event.dataTransfer.setData).toHaveBeenCalledWith('dragIndex', '10');
    expect(el.nativeElement.classList.add).toHaveBeenCalledWith('dragged');
  });

  it('dragend should remove "dragged" from element classList', () => {
    spyOn(el.nativeElement.classList, 'remove');
    dragItemDirective.dragend();
    expect(el.nativeElement.classList.remove).toHaveBeenCalledWith('dragged');
  });

  it('dragover should call preventDefault on $event(to allow drop) and add "dragovered" class to element', () => {
    let $event: DragEvent = <any>{
      preventDefault: (): void => {
      }
    };
    spyOn($event, 'preventDefault');
    spyOn(el.nativeElement.classList, 'add');
    dragItemDirective.dragover($event);
    expect($event.preventDefault).toHaveBeenCalled();
    expect(el.nativeElement.classList.add).toHaveBeenCalledWith('dragovered');
  });

  it('dragleave should remove "dragovered" from element classList', () => {
    spyOn(el.nativeElement.classList, 'remove');
    dragItemDirective.dragleave();
    expect(el.nativeElement.classList.remove).toHaveBeenCalledWith('dragovered');
  });

  it('drop should remove "dragovered" and swap between dropIndex & dragIndex if they not equal', () => {
    let dropIndex = 2;
    let dragIndex = 2;

    dragItemDirective.appDragItem = [dropIndex, [1, 2, 3, 4, 5, 6]];
    let $event: DragEvent = <any>{ dataTransfer: { getData: (): number => dragIndex } };
    el.nativeElement.classList = {
      remove: (class_name): void => {
      }
    };

    spyOn(el.nativeElement.classList, 'remove');
    spyOn(dragItemDirective.onDrop, 'emit');

    dragItemDirective.drop($event);
    expect(el.nativeElement.classList.remove).toHaveBeenCalledWith('dragovered');
    expect(dragItemDirective.appDragItem[1]).toEqual([1, 2, 3, 4, 5, 6]);
    expect(dragItemDirective.onDrop.emit).not.toHaveBeenCalled();

    dragIndex = 3;
    dragItemDirective.drop($event);

    expect(dragItemDirective.appDragItem[1]).toEqual([1, 2, 4, 3, 5, 6]);
    expect(dragItemDirective.onDrop.emit).toHaveBeenCalledWith([1, 2, 4, 3, 5, 6]);
  });

  it('keyup should change "shift_down" value to false when shift trigger($event.which=16)', () => {
    dragItemDirective.shift_down = true;
    let $event = <any>{ which: 15 };
    dragItemDirective.keyup($event);
    expect(dragItemDirective.shift_down).toBeTruthy(); // no change
    $event.which = 16;
    dragItemDirective.keyup($event);
    expect(dragItemDirective.shift_down).toBeFalsy();
  });

  it('keydown should call keydownUp when key equal to up (40), keydownUp when key equal to down (38) and change "shift_down" value to true when key equal to shift (16)', () => {
    dragItemDirective.shift_down = false;
    spyOn(dragItemDirective, 'keydownDown');
    spyOn(dragItemDirective, 'keydownUp');

    let $event = <any>{ which: 38 };
    dragItemDirective.keydown($event);
    expect(dragItemDirective.keydownDown).toHaveBeenCalled();

    $event.which = 40;
    dragItemDirective.keydown($event);
    expect(dragItemDirective.keydownUp).toHaveBeenCalled();

    $event.which = 16;
    dragItemDirective.keydown($event);
    expect(dragItemDirective.shift_down).toBeTruthy();
  });


  it('keydownUp should call switchPrev when "shift_down" value is true else focusPrev', () => {
    dragItemDirective.shift_down = false;
    spyOn(dragItemDirective, 'switchPrev');
    spyOn(dragItemDirective, 'focusPrev');
    dragItemDirective.keydownUp();
    expect(dragItemDirective.focusPrev).toHaveBeenCalledTimes(1);
    expect(dragItemDirective.switchPrev).toHaveBeenCalledTimes(0);
    dragItemDirective.shift_down = true;
    dragItemDirective.keydownUp();
    expect(dragItemDirective.focusPrev).toHaveBeenCalledTimes(1);
    expect(dragItemDirective.switchPrev).toHaveBeenCalledTimes(1);
  });

  it('keydownDown should call switchNext when "shift_down" value is true else focusNext', () => {
    dragItemDirective.shift_down = false;
    spyOn(dragItemDirective, 'switchNext');
    spyOn(dragItemDirective, 'focusNext');
    dragItemDirective.keydownDown();
    expect(dragItemDirective.focusNext).toHaveBeenCalledTimes(1);
    expect(dragItemDirective.switchNext).toHaveBeenCalledTimes(0);
    dragItemDirective.shift_down = true;
    dragItemDirective.keydownDown();
    expect(dragItemDirective.switchNext).toHaveBeenCalledTimes(1);
    expect(dragItemDirective.focusNext).toHaveBeenCalledTimes(1);
  });

  it('switchNext should swap between dropIndex to next index', () => {
    let dropIndex = 2;
    dragItemDirective.appDragItem = [dropIndex, [1, 2, 3, 4, 5, 6]];
    dragItemDirective.switchNext();
    expect(dragItemDirective.appDragItem[1]).toEqual([1, 2, 4, 3, 5, 6]);
  });

  it('switchPrev should swap between dropIndex to prev index', () => {
    let dropIndex = 2;
    dragItemDirective.appDragItem = [dropIndex, [1, 2, 3, 4, 5, 6]];
    dragItemDirective.switchPrev();
    expect(dragItemDirective.appDragItem[1]).toEqual([1, 3, 2, 4, 5, 6]);
  });

  it('focusNext should take next element from element fathers children and focus on him', () => {
    el.nativeElement.parentElement.children.indexOf = () => 0; // elem1
    let elem_next = el.nativeElement.parentElement.children[1];
    spyOn(elem_next, 'focus');
    dragItemDirective.focusNext();
    expect(elem_next.focus).toHaveBeenCalled();
  });

  it('focusPrev should take prev element from element fathers children and focus on him', () => {
    el.nativeElement.parentElement.children.indexOf = () => 1; // elem2
    let elem_prev = el.nativeElement.parentElement.children[0];
    spyOn(elem_prev, 'focus'); // prev element;
    dragItemDirective.focusPrev();
    expect(elem_prev.focus).toHaveBeenCalled();
  });

});
