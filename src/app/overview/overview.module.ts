import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GraphQLModule } from '../graphql.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    FormsModule,
    GraphQLModule,
    MatSnackBarModule
  ]
})
export class OverviewModule { }
