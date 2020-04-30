import { of } from 'rxjs';

export class HttpMock{
  get(url){return of()};
}