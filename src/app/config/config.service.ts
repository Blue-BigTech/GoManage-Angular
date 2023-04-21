import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Employees, Bookings } from './employees';
import { environment } from 'environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ConfigService {
  private configUrl = environment.auth.apiUri;
  postId: number;
  constructor(private http: HttpClient) { }


  getBookings(): Observable<any> {
    return this.http
      .get<any[]>(this.configUrl + "/bookings/retrieveBookings")
      .pipe(map(data => data),
        catchError(this.handleError));
  }

  addNewBooking(newBooking: any): Observable<any> {
    const headers = { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    const body = JSON.stringify(newBooking);
    return this.http.post(this.configUrl + 'bookings/saveBooking', body, { 'headers': headers })
  }

  removeBooking(bookingId: number) {
    this.http
      .delete(this.configUrl + "/bookings/deleteBooking/" + bookingId)
      .subscribe((s) => {
        console.log(s);
      });
  }

  updateBooking(updateBooking: any) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(updateBooking);
    this.http.put<Bookings>(this.configUrl + 'updateBookings/' + updateBooking.id, updateBooking)
      .subscribe(data => this.postId = data.id);
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