import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageList } from './package-list/package-list';
import { PackageForm } from './package-form/package-form';

const routes: Routes = [
  { path: '', component: PackageList },
  { path: 'new', component: PackageForm },
  { path: ':id/edit', component: PackageForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule {}