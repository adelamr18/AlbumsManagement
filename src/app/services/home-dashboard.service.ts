import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HomeDashboardService {
  baseUrl = 'http://jsonplaceholder.typicode.com';
  userId:number=0;
  curruentClickedAlbumId:number=0;
  currentSelectedAlbum:any;
  currentUserAlbums:any

  constructor(private http: HttpClient) { }

  showUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }
  showUsersAlbums(id){
    return this.http.get(`${this.baseUrl}/albums?userId=${id}`);
  }
  showUsersPhotos(id){
    return this.http.get(`${this.baseUrl}/photos?albumId=${id}`);
  }
  addUserAlbum(body){
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json; charset=UTF-8');
    const options = {
      headers: headers
    };
    const reqBody = body;
    return this.http.post(`${this.baseUrl}/albums?userId=${this.userId}`, reqBody, options)

  }

}
