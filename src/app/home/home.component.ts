import { Component, OnInit } from '@angular/core';
import { inOutAnimation } from '../animations/slide';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [inOutAnimation('300ms')],
})
export class HomeComponent implements OnInit {

  slide = 1;

  constructor() { }

  ngOnInit() {
  }

}
