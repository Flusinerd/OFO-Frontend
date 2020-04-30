export class CookieServiceMock{
  check(cookieName){return true}
  get(cookeieName){return 'CoockieValueMock'}
  set(cookieName, cookieValue){}
}