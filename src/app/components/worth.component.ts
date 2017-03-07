/**
 * Created by lorenzogagliani on 07/03/17.
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';
import { DialogsService } from "../modals/modalservices/dialog.services";

@Component({
  selector: "worth",
  templateUrl: 'app/components/worth.template.html',
  styleUrls: ['app/components/worth.style.css']
})
export class WorthComponent {
  constructor(
    private dialogsService: DialogsService,
  ) { }

  @Input() myWorth: number;
  @Input() myProfLoss: number;

  ngOnInit() {

  }

  isLoss(): boolean{
    if (this.myProfLoss < 0) 
      return true;
    else
      return false;
  }

}
