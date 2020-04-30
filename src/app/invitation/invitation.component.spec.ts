import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationComponent } from './invitation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteMock } from '../../testing/activated-route.mock' 
import { Apollo } from 'apollo-angular';
import { ApolloMock } from '../../testing/apollo.mock';
import { RouterMock } from '../../testing/router.mock';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMock } from '../../testing/snackbar.mock';
import { CookieService } from 'ngx-cookie-service';
import { CookieServiceMock } from '../../testing/cookie-service.mock';

describe('InvitationComponent', () => {
  let component: InvitationComponent;
  let fixture: ComponentFixture<InvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
        { provide: Apollo, useClass: ApolloMock},
        { provide: Router, useClass: RouterMock},
        { provide: MatSnackBar, useClass: SnackbarMock},
        { provide: CookieService, useClass: CookieServiceMock},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
