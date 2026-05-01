import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list';
import { ClientForm } from './client-form/client-form';
import { ClientDetail } from './client-detail/client-detail';

// const routes: Routes = [
//   { path: '', component: ClientListComponent },
//   { path: 'new', component: ClientForm },
//   { path: ':id/edit', component: ClientForm },
//   { path: ':id', component: ClientDetail },
// ];
const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'new', component: ClientForm },
  { path: ':id/edit', component: ClientForm },
  { path: ':id', component: ClientDetail },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}