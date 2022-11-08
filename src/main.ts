import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './app/material-module';
import { SharedModule } from './app/shared-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { routes } from './app/routes';

import { PropertyFullDetailsComponent } from './app/full-details-example';
import { PropertyFullDetailsModule } from './app/full-details.module';

import { AnnotateComponent } from './app/annotate/annotate.component';

// Default MatFormField appearance to 'fill' as that is the new recommended approach and the
// `legacy` and `standard` appearances are scheduled for deprecation in version 10.
// This makes the examples that use MatFormField render the same in StackBlitz as on the docs site.
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    SharedModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    PropertyFullDetailsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  entryComponents: [PropertyFullDetailsComponent, AnnotateComponent],
  declarations: [PropertyFullDetailsComponent, AnnotateComponent],
  bootstrap: [PropertyFullDetailsComponent, AnnotateComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
})
export class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
