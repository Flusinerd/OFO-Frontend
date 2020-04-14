import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitationRoutingModule } from './invitation-routing.module';
import { InvitationComponent } from './invitation.component';


@NgModule({
  declarations: [InvitationComponent],
  imports: [
    CommonModule,
    InvitationRoutingModule
  ]
})
export class InvitationModule { }
