/**
 * Created by cicca on 06/03/2017.
 */
import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
        <p>{{ title }}</p>
        <p>{{ message }}</p>
        <button type="button" md-raised-button 
            (click)="dialogRef.close(true)">OK</button>
    `,
})
export class ConfirmDialog {

  public title: string;
  public message: string;

  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

  }
}
