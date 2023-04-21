import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAccessComponent } from './staff-access.component';

describe('StaffAccessComponent', () => {
  let component: StaffAccessComponent;
  let fixture: ComponentFixture<StaffAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
