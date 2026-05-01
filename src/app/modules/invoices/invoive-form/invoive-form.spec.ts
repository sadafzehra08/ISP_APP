import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiveForm } from './invoive-form';

describe('InvoiveForm', () => {
  let component: InvoiveForm;
  let fixture: ComponentFixture<InvoiveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiveForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiveForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
