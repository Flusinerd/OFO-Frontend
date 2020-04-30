import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { ApolloMock } from '../../testing/apollo.mock';
import { WindowMock } from '../../testing/windows.mock';
import { CookieService } from 'ngx-cookie-service';
import { CookieServiceMock } from '../../testing/cookie-service.mock';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMock } from '../../testing/snackbar.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ HomeComponent ],
      providers: [
        FormBuilder,
        { provide: Apollo, useClass: ApolloMock },
        { provide: Window, useClass: WindowMock },
        { provide: CookieService, useClass: CookieServiceMock },
        { provide: MatSnackBar, useClass: SnackbarMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
