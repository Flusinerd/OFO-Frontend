import { of } from 'rxjs';

export class ApolloMock{
  query(config){
    return of();
  }

  mutate(config){return of();}
}