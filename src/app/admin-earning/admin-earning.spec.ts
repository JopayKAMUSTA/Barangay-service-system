import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEarning } from './admin-earning';

describe('AdminEarning', () => {
  let component: AdminEarning;
  let fixture: ComponentFixture<AdminEarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEarning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEarning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
