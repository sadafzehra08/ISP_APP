import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from '../../src/app/models/payment.model';

@Pipe({ name: 'countBy' })
export class CountByPipe implements PipeTransform {
  transform(payments: Payment[], method: string): number {
    return payments.filter(p => p.method === method).length;
  }
}