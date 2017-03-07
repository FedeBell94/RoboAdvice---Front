/**
 * Created by cicca on 06/03/2017.
 */

import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  template: `
              <p> You are changing your strategy. <br>Are you sure?</p>
        <button type="button" md-raised-button 
            (click)="dialogRef.close(true)">OK</button>
            
            <button type="button" md-raised-button 
            (click)="dialogRef.close(false)">Cancel</button>
            
    `,
})
export class ConfirmDialog {


  constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

  }
}
