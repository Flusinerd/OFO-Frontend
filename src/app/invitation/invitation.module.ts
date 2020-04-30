import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { InvitationRoutingModule } from './invitation-routing.module';
import { InvitationComponent } from './invitation.component';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GraphQLModule } from '../graphql.module';


@NgModule({
  declarations: [InvitationComponent],
  imports: [
    CommonModule,
    InvitationRoutingModule,
    FormsModule,
    MatSnackBarModule,
    GraphQLModule
  ],
  providers: [
    CookieService
  ]
})
export class InvitationModule { }
