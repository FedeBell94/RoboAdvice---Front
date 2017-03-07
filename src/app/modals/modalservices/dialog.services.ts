/**
 * Created by cicca on 06/03/2017.
 */
import { Observable } from 'rxjs/Rx';
import { SuccessDialog } from '../modalscomponent/success-dialog.components';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import {ConfirmDialog} from "../modalscomponent/confirm-dialog.components";

@Injectable()
export class DialogsService {

  constructor(private dialog: MdDialog) { }


  public success(title: string, message: string): Observable<boolean> {

    let dialogRef: MdDialogRef<SuccessDialog>;

    dialogRef = this.dialog.open(SuccessDialog);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }


  public confirm(): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);


    return dialogRef.afterClosed();
  }





}
