import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GraphQLModule } from '../graphql.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    GraphQLModule
  ],
  providers: [
    CookieService
  ]
})
export class HomeModule { }
