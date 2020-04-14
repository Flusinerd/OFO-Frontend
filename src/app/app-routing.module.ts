import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.page';


const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    HomeComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
