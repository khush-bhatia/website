import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SuccessDialogService } from '../../services/success-dialog.service';
import { ErrorDialogService } from '../../services/error-dialog.service';
import { MdDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';

@Component({
  selector: 'user-profile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})

export class UserProfileComponent {
  user: any = null;
  token : any= null;
  tokenTip : string = "Use the userid as username and this token as password to authenticate over basic auth for REST API and MQTT. Make sure to copy it now. You won’t be able to see it again!";
 
  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private successDialogService: SuccessDialogService,
              private errorDialogService: ErrorDialogService,
              public dialog: MdDialog
               ) {

  }

ngOnInit() {
     this.getUser();
     this.getToken();
}

getUser(){
  this.userService.getUser().subscribe(
     result => this.user = result,
     error =>  this.errorDialogService.dialogPopup(error.message)
   );
}

updateUser(){
  this.userService.updateUser(this.user).subscribe(
      result => {
        this.getUser();
        this.successDialogService.dialogPopup("Done");
      },
      error =>  this.errorDialogService.dialogPopup(error.message)
    );
 }

getToken(){
   this.userService.getToken().subscribe(
      result => this.token = result,
      error =>  {
        if(error.status != 404){
            this.errorDialogService.dialogPopup(error.message);
        }else{
          this.token = null;
        }
      });
 }

 createUserToken() {
    this.userService.createToken().subscribe(
      result => {
        this.getToken();
        this.successDialogService
        .dialogPopupNoAutoClose("Token : " + result, this.tokenTip);
      },
      error => {
        this.errorDialogService
        .dialogPopup(error.message );
      }
      );
  }
 deleteUserToken() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogText = "Delete user token " + "? ";
    dialogRef.componentInstance.dialogWarning = "The token will no longer work for authentication over REST and MQTT."
    dialogRef.componentInstance.confirmText = "Delete";
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.userService.deleteToken().subscribe(
            result => {
              this.getToken();
              this.successDialogService
              .dialogPopup('Successfully deleted token');               
            },
            error => this.errorDialogService
            .dialogPopup(error.message)
            );// End delete token subscribe.
        } // End if
      } // End result
      ); // End subscribe    
  } // End function



 
}