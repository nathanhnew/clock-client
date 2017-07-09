import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockItemComponent } from './clock-item.component';

describe('ClockItemComponent', () => {
  let component: ClockItemComponent;
  let fixture: ComponentFixture<ClockItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
