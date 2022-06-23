import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, MaxLengthValidator, MaxValidator, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalr';
import { NameDialogComponent } from '../name-dialog/name-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FileServiceService } from 'src/app/Services/file-service.service';


interface Message{
  userName:string;
  text: string;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userName!: string;
  shortLink: string = '';
  loading: boolean = false; // Flag variable
  file!: File;

  messageControl = new FormControl(null);
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:26369/chat')
    .build();
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private fileUploadService: FileServiceService) {
    this.openDialog();
  }
  ngOnInit(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '250px',
      data: this.userName,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.userName = res;
      this.startConnection();
      this.openSnackBar(res);
    });
  }
  openSnackBar(userName: string) {
    const message = userName == this.userName ? 'Welcome' : `${userName} Online`;
    this.snackBar.open(message, 'Now', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  startConnection() {
    this.connection.on('newMessage', (userName: string, text: string) => {
      this.messages.push({
        text: text,
        userName: userName,
      });
    });
    this.connection.on('newUser', (userName: string) => {
      this.openSnackBar(userName);
    });
    this.connection.on('previousMessages', (messages: Message[]) => {
      this.messages = messages;
    });
    this.connection.start().then(() => {
      this.connection.send(
        'newUser',
        this.userName,
        this.connection.connectionId
      );
    });
  }
  onChange(event: any) {
    this.file = event.target.files[0];
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof event === 'object') {
        // Short link via api response
        this.shortLink = event.link;
        this.loading = false; // Flag variable
        this.messageControl.setValue(this.shortLink);
      }
    });
  }
  sendMessage() {
    this.connection
      .send('newMessage', this.userName, this.messageControl.value)
      .then(() => {
        this.messageControl.setValue('');
      });
  }
}


