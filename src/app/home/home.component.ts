import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { inOutAnimation } from '../animations/slide';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { EventEntity } from '../../shared/event/event.interface';
import { EventUserEntity } from '../../shared/event_user/event_user.interface';
import { CreateEventResponse } from '../../shared/event/createEvent.response';
import { AddDatesResponse } from '../../shared/frontend/addDates.response';
import { AddPlatformsResponse } from '../../shared/frontend/addPlatforms.response';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';

export const WINDOW = new InjectionToken('window',
    { providedIn: 'root', factory: () => window }
);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [inOutAnimation('300ms')],
})
export class HomeComponent implements OnInit {

  slide = 1; // Sets the actual view
  private _event: EventEntity;
  private _user: EventUserEntity;

  constructor(private _fb: FormBuilder,
              private _apollo:Apollo,
              @Inject(WINDOW) private window: Window,
              private _cookieService: CookieService,
              private _snackBar: MatSnackBar) { }

  eventForm = this._fb.group({
    title: ['', Validators.required],
    dates: this._fb.array([
      this._fb.group({
        date: [null, Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required]
      })
    ]),
    platforms: this._fb.array([
      this._fb.group({
        platformName: ['', Validators.required],
      }),
    ]),
    emails: this._fb.array([
      this._fb.group({
        mailAdress: [''],
      })
    ]),
  });

  /**
   * Inits the component
   */
  ngOnInit() {
    this.addDateGroup();
    this.addPlatformGroup();
    this.addEmailGroup();
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
   * Adds a new dategroup to the dates form
   */
  addDateGroup(): void {
    const group = this._fb.group({
      date: [null],
      startTime: [null],
      endTime: [null]
    });

    this.dates.push(group);
  }

  /**
   * Adds a new Platform to the platforms form
   */
  addPlatformGroup(): void {
    const group = this._fb.group({
      platformName: [''],
    });

    this.platforms.push(group);
  }

  /**
   * Adds a new email to the emails form
   */
  addEmailGroup(): void {
    const group = this._fb.group({
      mailAdress: [''],
    });

    this.emails.push(group);
  }

  /**
   * Checks if a new row needs to be appended to the date form
   * @param index Index of the row, the event was fired on
   */
  checkForNewDateRow(index: number): void {
    if (index === this.dates.length - 1) {
      this.addDateGroup();
    }
  }

  /**
   * Checks if a new row needs to be appended to the platform form
   * @param index Index of the row, the event was fired on
   */
  checkForNewPlatformRow(index: number): void {
    if (index === this.platforms.length - 1) {
      this.addPlatformGroup();
    }
  }

  /**
   * Checks if a new row needs to be appended to the email form
   * @param index Index of the row, the event was fired on
   */
  checkForNewEmailRow(index: number): void {
    if (index === this.emails.length - 1) {
      this.addEmailGroup();
    }
  }

  /**
   * Handles next page click
   */
  next(): void {
    this._createEvent();
  }
  
  /**
   * Creates the Event and adds the event to the known events cookie
   */
  share(): void {
    let formData = this.eventForm.value;
    formData.dates.pop();
    formData.platforms.pop();
    this.addPlatforms();
    if (this._cookieService.check('knownEvents')) {
      let cookie = this._cookieService.get('knownEvents');
      this._cookieService.set('knownEvents', cookie+' '+this._event.eventId);
    } else {
      this._cookieService.set('knownEvents', this._event.eventId);
    }
  }

  /**
   * Copies the event link to the clipboard
   */
  copyLink(): void {
    const el = document.createElement('textarea');
    if (this.window.location.port){
      el.value =
        this.window.location.protocol + '//' + this.window.location.hostname + ':' + this.window.location.port + '/' + this._event.eventId;
    } else {
      el.value =
        this.window.location.protocol + '//' + this.window.location.hostname + '/' + this._event.eventId;
    }
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this._snackBar.open('In Zwischenablage kopiert.', 'Schließen', { duration: 3000 });
  }

  /**
   * Handles retry
   */
  retry(): void {
    this.eventForm.reset();
    this.slide = 1;
  }

  /**
   * Creates the event in the backend
   */
  private _createEvent(){
    const title = this.eventForm.value.title;
    this._apollo.mutate<CreateEventResponse>({
      mutation: gql`mutation createEvent($title: String!){
          createEvent(input: {title: $title}) {id, title, eventId}
      }`,
      variables: { title }
    })
    .subscribe(({data}) => {
      this._event = data.createEvent;
      this._createUser();
    }, (error) => {
      console.error(error);
      this.slide = 0;
    })
  }

  /**
   * Creates a new user in the backend and links it to the event
   */
  private _createUser(){
    const eventId = this._event.id;
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
      this.addDates();
    }, (error) =>{
      console.error(error);
      this.slide = 0;
    })
  }

  /**
   * Adds the dates to the user in the backend
   */
  private addDates(){
    const dates = [];
    for (const date of this.dates.value) {
      if (date.date === null || date.startTime === null) continue;
      const startDate = new Date(`${date.date}T${date.startTime}:00.000`).toISOString();
      let endDate;
      if (date.endTime !== null){
        endDate = new Date(`${date.date}T${date.endTime}:00.000`).toISOString();
      } else {
        endDate = new Date(`${date.date}T23:59:59.000`).toISOString();
      }
      dates.push({startDate, endDate})
    }
    this._apollo.mutate<AddDatesResponse>({
      mutation: gql`
        mutation addDates($dates: [DateInput!], $userId: Int!) {
          addDates(input: { userId: $userId, dates: $dates }) {
            dates {
              id
              startDate
              endDate
            }
          }
        }
      `,
      variables: {
        dates,
        userId: this._user.id
      }
    }).subscribe(({data}) => {
      this._user.dates = data.addDates.dates;
    })
  }

  /**
   * Adds the platforms the user in the backend
   */
  private addPlatforms(){
    const platforms = [];
    for (const platform of this.platforms.value) {
      platforms.push({title: platform.platformName});
    }
    this._apollo.mutate<AddPlatformsResponse>({
      mutation: gql`
        mutation addPlatforms($platforms: [PlatformInput!], $userId: Int!) {
          addPlatforms(input: { userId: $userId, platforms: $platforms }) {
            platforms {
              id
              title
            }
          }
        }
      `,
      variables: {
        platforms,
        userId: this._user.id
      }
    })
    .subscribe(({data}) => {
      this._user.platforms = data.addPlatforms.platforms;
    })
  }

  /**
   * Sends the invite mails 
   */
  private sendMails(){
    const emails = [];
    for (const email of this.emails.value) {
      if (email.mailAdress != '') {
        emails.push(email.mailAdress);
      }
    }
    this._apollo.mutate<AddPlatformsResponse>({
      mutation: gql`
        mutation($link:String!,$eventId: Int!, $emails: [String!]!){
          sendEmails(input:{
            link:$link,
            eventId:$eventId,
            emails: $emails
          })
        }
      `,
      variables: {
        link: this.window.location.protocol + '//' + this.window.location.hostname + ':'
        + this.window.location.port + '/' + this._event.eventId,
        eventId: this._event.id,
        emails
      }
    })
    .subscribe(({data}) => {
      this.eventForm.reset();
    }, (error) => {
      console.error(error);
      this.slide = 0;
    });
  }

  /**
   * Handles send button click
   */
  send(): void{
    this.sendMails();
    setTimeout(() => {
      this.slide = 1;
    }, 3000)
  }

  get title(): AbstractControl {
    return this.eventForm.get('title');
  }

  get dates(): FormArray {
    return this.eventForm.get('dates') as FormArray;
  }
  
    get platforms(): FormArray {
      return this.eventForm.get('platforms') as FormArray;
    }
  
    get emails(): FormArray {
      return this.eventForm.get('emails') as FormArray;
    }
  
  get user(): EventUserEntity {
    return this._user;
  }
}
