import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyInfoWindowComponent } from './nanny-info-window.component';

describe('NannyInfoWindowComponent', () => {
  let component: NannyInfoWindowComponent;
  let fixture: ComponentFixture<NannyInfoWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NannyInfoWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NannyInfoWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
