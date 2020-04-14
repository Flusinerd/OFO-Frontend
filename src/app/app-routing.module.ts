import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'invitation',
    loadChildren: () =>
      import('./invitation/invitation.module').then((m) => m.InvitationModule),
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./overview/overview.module').then((m) => m.OverviewModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
