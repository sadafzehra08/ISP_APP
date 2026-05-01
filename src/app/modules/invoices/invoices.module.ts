import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoiceList } from './invoice-list/invoice-list';
import { InvoiveForm } from './invoive-form/invoive-form';
import { InvoiceDetail } from './invoice-detail/invoice-detail';
//import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

@NgModule({
  declarations: [InvoiceList, InvoiveForm, InvoiceDetail],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InvoicesRoutingModule],
})
export class InvoicesModule {}
