import { TestBed, inject } from '@angular/core/testing';

import { ContextMenuService } from './context-menu.service';

describe('ContextMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextMenuService]
    });
  });

  it('should be created', inject([ContextMenuService], (service: ContextMenuService) => {
    expect(service).toBeTruthy();
  }));
});
