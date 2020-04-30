import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { HttpMock } from '../testing/http.mock';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useClass: HttpMock }
      ]
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
