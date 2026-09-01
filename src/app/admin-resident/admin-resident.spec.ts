import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResident } from './admin-resident';

describe('AdminResident', () => {
  let component: AdminResident;
  let fixture: ComponentFixture<AdminResident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResident]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResident);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
