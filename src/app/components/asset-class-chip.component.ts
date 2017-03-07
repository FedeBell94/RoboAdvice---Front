/**
 * Created by lorenzogagliani on 07/03/17.
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';
import { DialogsService } from "../modals/modalservices/dialog.services";

@Component({
  selector: "asset-class-chip",
  templateUrl: 'app/components/asset-class-chip.template.html',
  styleUrls: ['app/components/asset-class-chip.style.css']
})
export class AssetClassChipComponent {
  constructor(
    private dialogsService: DialogsService,
  ) { }

  @Input() label: string;
  @Input() value: number;
  @Input() profLoss: number;

  ngOnInit() {

  }


}
