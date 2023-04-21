import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientsComponent } from './add-clients.component';

describe('AddClientsComponent', () => {
  let component: AddClientsComponent;
  let fixture: ComponentFixture<AddClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
