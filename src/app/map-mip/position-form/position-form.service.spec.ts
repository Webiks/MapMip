import { inject, TestBed } from '@angular/core/testing';
import { PositionFormService } from './position-form.service';
import { EventEmitter } from '@angular/core';

describe('PositionFormService', () => {
  let positionFormService: PositionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PositionFormService]
    });
  });

  beforeEach(inject([PositionFormService], (_positionFormService: PositionFormService) => {
    positionFormService = _positionFormService;
  }));

  it('should positionFormService be defined', () => {
    expect(positionFormService).toBeDefined();
  });

  it('should markerPickerEmitter initialize as  EventEmitter', () => {
    expect(positionFormService.markerPickerEmitter instanceof EventEmitter).toBeTruthy();
  });

});
