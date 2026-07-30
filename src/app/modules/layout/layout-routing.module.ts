import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
       { path: 'clients', loadChildren: () => import('../clients/clients.module').then(m => m.ClientsModule) },
      { path: 'packages', loadChildren: () => import('../packages/packages-module').then(m => m.PackagesModule) },
      { path: 'invoices', loadChildren: () => import('../invoices/invoices.module').then(m => m.InvoicesModule) },
      { path: 'payments', loadChildren: () => import('../payments/payments-module').then(m => m.PaymentsModule) },
      { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
    //   { path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule) },
    //   { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
    { path: 'receipts', loadChildren: () => import('../receipts/receipts.module').then(m => m.ReceiptsModule) }


     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}