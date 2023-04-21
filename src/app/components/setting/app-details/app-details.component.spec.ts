import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsDetailsComponent } from './app-details.component';

describe('AppsDetailsComponent', () => {
  let component: AppsDetailsComponent;
  let fixture: ComponentFixture<AppsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
