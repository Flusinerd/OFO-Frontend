import { Component, OnInit } from '@angular/core';
import { inOutAnimation } from '../animations/slide';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { EventEntity } from '../../shared/event/event.interface';
import { EventUserEntity } from '../../shared/event_user/event_user.interface';
import { CreateEventResponse } from '../../shared/event/createEvent.response';
import { AddDatesResponse } from '../../shared/frontend/addDates.response';
import { AddPlatformsResponse } from '../../shared/frontend/addPlatforms.response';

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

  constructor(private _fb: FormBuilder, private _apollo:Apollo) { }

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
  });

  addDateGroup(): void {
    const group = this._fb.group({
      date: [null],
      startTime: [null],
      endTime: [null]
    });

    this.dates.push(group);
  }

  addPlatformGroup(): void {
    const group = this._fb.group({
      platformName: [''],
    });

    this.platforms.push(group);
  }

  checkForNewDateRow(index: number): void {
    if (index === this.dates.length - 1) {
      this.addDateGroup();
    }
  }

  checkForNewPlatformRow(index: number): void {
    if (index === this.platforms.length - 1) {
      this.addPlatformGroup();
    }
  }

  next(): void {
    this._createEvent();
  }
  
  share(): void {
    let formData = this.eventForm.value;
    formData.dates.pop();
    formData.platforms.pop();
    console.log(formData);
    
  }

  ngOnInit() {
    this.addDateGroup();
    this.addPlatformGroup();
  }

  private _createEvent(){
    const title = this.eventForm.value.title;
    console.log(title);
    this._apollo.mutate<CreateEventResponse>({
      mutation: gql`mutation createEvent($title: String!){
          createEvent(input: {title: $title}) {id, title, eventId}
      }`,
      variables: { title }
    })
    .subscribe(({data}) => {
      this._event = data.createEvent;
      console.log(this._event);
      this._createUser();
    }, (error) => console.error(error))
  }

  private _createUser(){
    const eventId = this._event.id;
    console.log(eventId)
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
    }, (error) => console.error(error))
  }

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
      console.log(this._user);
    })
  }

  private addPlatforms(){
    const platforms = [];
    for (const platform of this.platforms.value) {
      platforms.push({title: platform});
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

  get title(): AbstractControl {
    return this.eventForm.get('title');
  }

  get dates(): FormArray {
    return this.eventForm.get('dates') as FormArray;
  }

  get platforms(): FormArray {
    return this.eventForm.get('platforms') as FormArray;
  }

  get user(): EventUserEntity {
    return this._user;
  }
}
