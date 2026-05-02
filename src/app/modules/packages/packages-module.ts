import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackageList } from './package-list/package-list';
import { PackageForm } from './package-form/package-form';

@NgModule({
  declarations: [PackageList, PackageForm],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PackagesRoutingModule]
})
export class PackagesModule {}