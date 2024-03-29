import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditLabelDialogComponent} from './edit-label-dialog.component';
import {MaterialsModule} from '../../../../../../shared/materials.module';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('EditLabelDialogComponent', () => {
  let component: EditLabelDialogComponent;
  let fixture: ComponentFixture<EditLabelDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabelDialogComponent ],
      imports: [MaterialsModule, FormsModule, NoopAnimationsModule],
      providers: [{provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA, useValue: []}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
