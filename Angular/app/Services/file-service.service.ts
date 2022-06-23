import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  baseUrl = "https://file.io"

  constructor(private http:HttpClient) { }

  // Returns an observable
  upload(file:any):Observable<any> {

      // Create form data
      const formData = new FormData();

      // Store form name as "file" with file data
      formData.append("file", file, file.name);
      return this.http.post(this.baseUrl, formData)
  }
}
