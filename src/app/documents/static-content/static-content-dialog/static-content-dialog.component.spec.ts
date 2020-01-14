import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticContentDialogComponent } from './static-content-dialog.component';
import {StaticContentComponent} from '../static-content/static-content.component';
import {MAT_DIALOG_DATA} from '@angular/material';

describe('StaticContentDialogComponent', () => {
  let component: StaticContentDialogComponent;
  let fixture: ComponentFixture<StaticContentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticContentDialogComponent, StaticContentComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: undefined}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});