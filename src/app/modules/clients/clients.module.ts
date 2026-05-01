import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientListComponent } from './client-list/client-list';

import { ClientForm } from './client-form/client-form';
import { ClientDetail } from './client-detail/client-detail';


@NgModule({
  declarations: [
    ClientListComponent,
    ClientForm,
 
    ClientForm,
    ClientDetail,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ClientsRoutingModule],
})
export class ClientsModule {}
