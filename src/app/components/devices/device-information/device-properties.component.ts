import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog.component';
import { ErrorDialogService } from '../../../services/error-dialog.service';
import { SuccessDialogService } from '../../../services/success-dialog.service';
import { PropertiesComponent } from '../../dialogs/properties.component';

@Component({
  selector: 'device-properties',
  templateUrl: './device-properties.component.html',
  styleUrls: ['./device-properties.component.scss']
})

export class DevicePropertiesComponent {
  @Input() device: Device;
  @Input() acl: any;
  @Output() updateDevice: EventEmitter<boolean> = new EventEmitter();
  
  constructor(private deviceService: DeviceService, 
    private router: Router, 
    private successDialogService: SuccessDialogService, 
    private errorDialogService: ErrorDialogService,
    public dialog: MdDialog
   ) {
  }


  updateDeviceMeta() {
    this.deviceService.updateDeviceById(this.device._id, this.device).subscribe(
      result => {
        this.successDialogService
        .dialogPopup("Updated: " + this.device.name);
      },
      error => {
        this.errorDialogService
        .dialogPopup(error.message + ': ' + this.device.name);
      }
      );
  }


  viewProperties() {
    let dialogRef = this.dialog.open(PropertiesComponent, { width: '600px' });
    dialogRef.componentInstance.properties = this.device.properties || {};
    dialogRef.componentInstance.source = this.device.name;
    dialogRef.afterClosed().subscribe(
      result => {
        if(result) {
          var newDevice = this.device;
          newDevice.properties = result;
          this.deviceService.updateDeviceById(this.device._id, newDevice).subscribe(
            res => this.successDialogService.dialogPopup("Updated Device: " + this.device.name),
            err => this.errorDialogService.dialogPopup(err.message)
            );
        }
      }
      );
  }

  gotoLocation() {
    if (this.device.location_id) {
      this.router.navigate(['/home/devices/', this.device.location_id]);
    }
  }

}