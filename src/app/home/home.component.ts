import { Component, OnInit } from '@angular/core';
import { inOutAnimation } from '../animations/slide';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CreateEventInput } from '../../shared/event/createEvent.input';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [inOutAnimation('300ms')],
})
export class HomeComponent implements OnInit {

  slide = 1; // Sets the actual view

  constructor(private _fb: FormBuilder) { }

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

  get title(): AbstractControl {
    return this.eventForm.get('title');
  }

  get dates(): FormArray {
    return this.eventForm.get('dates') as FormArray;
  }

  get platforms(): FormArray {
    return this.eventForm.get('platforms') as FormArray;
  }
}
