import { Component, OnInit } from '@angular/core';
import { inOutAnimation } from '../animations/slide';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AddDatesResponse } from '../../shared/frontend/addDates.response';
import { EventUserEntity } from '../../shared/event_user/event_user.interface';
import { AddPlatformsResponse } from '../../shared/frontend/addPlatforms.response';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
  animations: [inOutAnimation('300ms')],
})
export class InvitationComponent implements OnInit {

  private _activeRouteSUB: Subscription
  private eventId: string;

  event;

  _user;

  idError = false;
  
  pos = false;
  neg = false;

  date = '24.04.2020'; 

  slide = 1; // Sets the actual view

  constructor(private _activeRoute: ActivatedRoute,
              private _apollo:Apollo,
              private _router: Router,
              private _snackBar: MatSnackBar,
              private _cookieService: CookieService) { }

  /**
   * Inits the component
   */  
  ngOnInit() {
    if (!this._activeRouteSUB) {
      this._activeRouteSUB = this._activeRoute.paramMap.subscribe((params) => {
        this.eventId = params.get('eventId');
        if (this._cookieService.check('knownEvents')) {
          const cookies = this._cookieService.get('knownEvents').split(' ');
          if(cookies.find(x => x === this.eventId)) {
            return this._router.navigate(['overview', this.eventId]);
          }
        } 
        this._getEventData();
      })
    }
    // Check for Cookie Acceptance
    if (!this._cookieService.check('cookiesAccepted')) {
      let cookieWarning = this._snackBar.open('Wir brauchen 🍪!!', 'OK');
      cookieWarning.onAction().toPromise()
        .then(() => {
          this._cookieService.set('cookiesAccepted', 'Yeess Boiiiiiiiii');
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }
  
  /**
   * Gets the needed eventdata of the event
   */
  private _getEventData(){
    this._apollo.query({
      query: gql `
        query gql($eventId: String!) {
          event(input: { eventId: $eventId }) {
            id
            title
            dates {
              id
              startDate
              endDate
              users {
                id
              }
            }
            platforms {
              id
              title
              users {
                id
              }
            }
          }
        }
        `,
        variables: {
          eventId: this.eventId
        }
    })
    .subscribe(({data}:any) => {
      this.event = data.event;
    }, (error) => {
      console.error(error);
      this.idError = true;
      this.slide = 0;
    });
  }

  /**
   * Creates a new user and links the event to the user
   */
  private _createUser(){
    const eventId = this.event.id;
    this._apollo.mutate<{createEventUser: EventUserEntity}>({
      mutation: gql`
        mutation createUser($eventId: Int!) {
          createEventUser(input: {
            eventId: $eventId
          }) {
            id, 
            event{
              id,
              eventId
              title,
              dates { id, startDate, endDate },
              platforms { id, title }
            }
          }
        }
      `,
      variables: {
        eventId
      }
    })
    .subscribe(({data}) => {
      this._user = data.createEventUser;
      this.slide = 3;
      this.addDates();
    }, (error) => {
      console.error(error);
      this.slide = 0;
    });
  }

  /**
   * Links the selected dates to the user
   */
  private addDates(){
    const dateIds = [];
    for (const date of this.event.dates) {
      if (date.check === 1) {
        dateIds.push(date.id);
      }
    }
    this._apollo.mutate<AddDatesResponse>({
      mutation: gql`
        mutation addDates($dateIds: [Int!], $userId: Int!) {
          addDates(input: { userId: $userId, dateIds: $dateIds }) {
            dates {
              id
              startDate
              endDate
            }
          }
        }
      `,
      variables: {
        dateIds,
        userId: this._user.id
      }
    }).subscribe(({data}) => {
      this._user.dates = data.addDates.dates;
      this.addPlatforms();
    }, (error) => {
      console.error(error);
      this.slide = 0;
    });
  }

  /**
   * Links the selected platforms to the user
   */
  private addPlatforms(){
    const platformIds = [];
    for (let platform of this.event.platforms) {
      if (platform.check === 1) {
        platformIds.push(platform.id);
      }
    }
    this._apollo.mutate<AddPlatformsResponse>({
      mutation: gql`
        mutation addPlatforms($platformIds: [Int!], $userId: Int!) {
          addPlatforms(input: { userId: $userId, platformIds: $platformIds }) {
            platforms {
              id
              title
            }
          }
        }
      `,
      variables: {
        platformIds,
        userId: this._user.id
      }
    })
    .subscribe(({data}) => {
      this._user.platforms = data.addPlatforms.platforms;
      setTimeout(() => {
        this._router.navigate(['overview', this.eventId])
      }, 3000)
    }, (error) => {
      console.error(error);
      this.slide = 0;
    });
  }

  /**
   * Sets rowData.check to the state or, if rowData.check is already sets it to null
   * Used for the selecting of dates / platforms
   * @param rowData Rowdata of the buttons row
   * @param state true if accept button was clicked, false if decline button was clicked
   */
  check(rowData, state: boolean): void {
    if (rowData['check']){
      rowData['check'] = null;
    } else {
      if (state) {
        rowData['check'] = 1;
      } else {
        rowData['check'] = 2;
      }
    }
  }
  
  /**
   * Saves the filled out invite data to the backend
   */
  save(): void {
    this._createUser();
    if (this._cookieService.check('knownEvents')) {
      let cookie = this._cookieService.get('knownEvents');
      this._cookieService.set('knownEvents', cookie+' '+this.eventId);
    } else {
      this._cookieService.set('knownEvents', this.eventId);
    }
  }
  
  /**
   * Handles retry
   */
  retry(): void {
    this.slide = 1;
  }

  /**
   * Converts the dateEntity to a readable format
   * @param startDate startDate of the dateEntity
   * @param endDate endDate of the dateEntity
   */
  convertDate(startDate: string, endDate: string): string {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    return sDate.toLocaleDateString() + ' \t ' + this._appendZeros(sDate.getHours())  + ':' + 
    this._appendZeros(sDate.getMinutes()) +
    ' - ' + this._appendZeros(eDate.getHours())+ ':' + this._appendZeros(eDate.getMinutes()) + '';
  }

  /**
   * Returns a number as string that has 2 digits (filled left with 0)
   * @param input Number input
   */
  private _appendZeros(input: number): string{
    if (input < 10) {
      return '0' + input;
    } else {
      return input.toString();
    }
  }

  /**
   * Checks if all dates are either accepted or declined
   */
  checkValidity(): boolean {
    for (let date of this.event.dates) {
      if (!date.check) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if all platforms are either accpted or declined
   */
  checkValidPlatforms(): boolean {
    for (let platform of this.event.platforms) {
      if (!platform.check) {
        return true;
      }
    }
    return false;
  }

}
