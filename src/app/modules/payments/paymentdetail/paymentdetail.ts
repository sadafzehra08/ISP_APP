
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Payment } from '../../../models/payment.model';

// @Component({
//   selector: 'app-paymentdetail',
//   standalone: false,
//   templateUrl: './paymentdetail.html',
//   styleUrl: './paymentdetail.scss',
// })
// export class Paymentdetail implements OnInit {

//   payment: Payment | undefined;

//   private methodIcons: Record<string, string> = {
//     cash:          '💵',
//     jazzcash:      '📱',
//     easypaisa:     '📲',
//     bank_transfer: '🏦',
//     cheque:        '📄',
//     online:        '💻',
//   };

//   private methodLabels: Record<string, string> = {
//     cash:          'Cash',
//     jazzcash:      'JazzCash',
//     easypaisa:     'Easypaisa',
//     bank_transfer: 'Bank Transfer',
//     cheque:        'Cheque',
//     online:        'Online',
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.params['id'];
//     this.loadPayment(+id);
//   }

//   private loadPayment(id: number): void {
//     this.payment = {
//       id:            1,
//       paymentNo:     'PAY-2025-0001',
//       clientId:      1,
//       clientName:    'Ahmed Raza',
//       clientCode:    'NP-0001',
//       clientPhone:   '0300-1234567',
//       invoiceId:     1,
//       invoiceNo:     'INV-2025-0001',
//       amount:        1200,
//       method:        'cash',
//       status:        'completed',
//       paymentDate:   '2025-05-03',
//       receivedBy:    'Admin',
//       packageName:   '10 Mbps Basic',
//       areaName:      'Gulshan-e-Iqbal',
//       createdAt:     '2025-05-03',
//     };
//   }

//   getMethodIcon(method: string): string {
//     return this.methodIcons[method] ?? '💳';
//   }

//   getMethodLabel(method: string): string {
//     return this.methodLabels[method] ?? method;
//   }

//   back(): void  { this.router.navigate(['/payments']); }
//   edit(): void  { if (this.payment?.id) this.router.navigate(['/payments', this.payment.id, 'edit']); }
//   print(): void { window.print(); }
// }