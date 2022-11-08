import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DemoMaterialModule } from './material-module';
import { SharedModule } from './shared-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DemoMaterialModule,
    SharedModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  exports: []
})
export class PropertyFullDetailsModule {}
