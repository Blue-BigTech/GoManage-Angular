import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRotaComponent } from './staff-rota.component';

describe('StaffRotaComponent', () => {
  let component: StaffRotaComponent;
  let fixture: ComponentFixture<StaffRotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffRotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
