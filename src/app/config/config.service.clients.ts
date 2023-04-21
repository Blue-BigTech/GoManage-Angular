import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable()
export class ClientsService {
  private configUrl = environment.auth.apiUri + '/resource-server/';

  constructor(private http: HttpClient) { }

  async getClients() {

    console.log('url =----' , this.configUrl + "clients")

    return await this.http.get(environment.auth.apiUri+'/user/retrieveAllUsersDetails');
    return await this.http
      .get<any[]>(environment.auth.apiUri+'/user/retrieveAllUsersDetails')
      .pipe(map(data => data),
        catchError(this.handleError));
  }

  async _getSingleClientDetail (email: string) {

    return await this.http.get(environment.auth.apiUri+'/user/retrieveUserDetails?email='+email)
  }

  async _getClientNotes () {
    return await this.http.get(environment.auth.apiUri+'/user/retrieveClientNotes')
  }

  

  async _deleteClientAppointmentNote (id: any) {
    return await this.http.get(environment.auth.apiUri+'/user/deleteClientComment?appointmentId='+id)
  }

  async _deleteClient (email: string) {

    return await this.http.get(environment.auth.apiUri+'/user/deleteUser?email='+email)
  }
  

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}