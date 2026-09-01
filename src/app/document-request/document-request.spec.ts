import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequest } from './document-request';

describe('DocumentRequest', () => {
  let component: DocumentRequest;
  let fixture: ComponentFixture<DocumentRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
