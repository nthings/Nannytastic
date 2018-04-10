import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Kids.DialogComponent } from './kids.dialog.component';

describe('Kids.DialogComponent', () => {
  let component: Kids.DialogComponent;
  let fixture: ComponentFixture<Kids.DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Kids.DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Kids.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
