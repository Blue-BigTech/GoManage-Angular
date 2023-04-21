import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffServicesComponent } from './staff-services.component';

describe('StaffServicesComponent', () => {
  let component: StaffServicesComponent;
  let fixture: ComponentFixture<StaffServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
