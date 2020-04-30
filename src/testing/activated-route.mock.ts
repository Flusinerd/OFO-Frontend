import { Subject } from 'rxjs';

export class ActivatedRouteMock{
  paramMap = new Subject();
}