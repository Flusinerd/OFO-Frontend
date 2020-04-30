import { Subject } from 'rxjs'

export class SnackbarMock{
  open(title, confirm){
    return {onAction: () => new Subject()}
  }
}