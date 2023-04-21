import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHeaderComponent } from './setting-header.component';

describe('SettingHeaderComponent', () => {
  let component: SettingHeaderComponent;
  let fixture: ComponentFixture<SettingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
