import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteMock } from '../../testing/activated-route.mock';
import { WindowMock } from '../../testing/windows.mock';
import { Apollo } from 'apollo-angular';
import { ApolloMock } from '../../testing/apollo.mock';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMock } from '../../testing/snackbar.mock';
import { CookieService } from 'ngx-cookie-service';
import { CookieServiceMock } from '../../testing/cookie-service.mock';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
        { provide: Window, useClass: WindowMock },
        { provide: Apollo, useClass: ApolloMock },
        { provide: MatSnackBar, useClass: SnackbarMock },
        { provide: CookieService, useClass: CookieServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
