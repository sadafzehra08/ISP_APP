import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paymentdetail } from './paymentdetail';

describe('Paymentdetail', () => {
  let component: Paymentdetail;
  let fixture: ComponentFixture<Paymentdetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Paymentdetail],
    }).compileComponents();

    fixture = TestBed.createComponent(Paymentdetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
