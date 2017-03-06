/**
 * Created by cicca on 06/03/2017.
 */
import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from '../page_components/confirm-dialog.components';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

  constructor(private dialog: MdDialog) { }

  public confirm(title: string, message: string): Observable<boolean> {

    let dialogRef: MdDialogRef<ConfirmDialog>;

    dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}
