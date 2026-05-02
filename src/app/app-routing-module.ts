


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';



const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: '',
    loadChildren: () =>
      import('./modules/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./modules/clients/clients.module').then(m => m.ClientsModule)
  },
  {
  path: 'invoices',
  loadChildren: () => import('./modules/invoices/invoices.module').then(m => m.InvoicesModule)
},
{
  path: 'payments',
  loadChildren: () => import('./modules/payments/payments-module').then(m => m.PaymentsModule)
},
{ path: 'packages', loadChildren: () => import('./modules/packages/packages-module').then(m => m.PackagesModule) },
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}