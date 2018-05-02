import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NannyDetailsComponent } from './nanny-details.component';

describe('NannyDetailsComponent', () => {
  let component: NannyDetailsComponent;
  let fixture: ComponentFixture<NannyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NannyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NannyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
