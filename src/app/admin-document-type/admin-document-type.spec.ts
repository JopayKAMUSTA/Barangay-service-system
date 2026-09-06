import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentType } from './admin-document-type';

describe('AdminDocumentType', () => {
  let component: AdminDocumentType;
  let fixture: ComponentFixture<AdminDocumentType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDocumentType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocumentType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
