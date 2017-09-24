import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuService } from './services/context-menu.service';

@NgModule({
  imports: [CommonModule],
  declarations: [ContextMenuComponent],
  exports: [ContextMenuComponent],
  providers: [ContextMenuService]
})
export class ContextMenuModule {
}
