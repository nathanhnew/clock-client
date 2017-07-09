import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockListComponent } from './clock-list.component';

describe('ClockListComponent', () => {
  let component: ClockListComponent;
  let fixture: ComponentFixture<ClockListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
