import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHeaderMenuComponent } from './staff-header-menu.component';

describe('StaffHeaderMenuComponent', () => {
  let component: StaffHeaderMenuComponent;
  let fixture: ComponentFixture<StaffHeaderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffHeaderMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffHeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
