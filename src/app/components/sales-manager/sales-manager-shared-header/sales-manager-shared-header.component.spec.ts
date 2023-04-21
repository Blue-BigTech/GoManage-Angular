import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagerSharedHeaderComponent } from './sales-manager-shared-header.component';

describe('SalesManagerSharedHeaderComponent', () => {
  let component: SalesManagerSharedHeaderComponent;
  let fixture: ComponentFixture<SalesManagerSharedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesManagerSharedHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesManagerSharedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
