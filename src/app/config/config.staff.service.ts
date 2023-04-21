import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Staff } from './staff';
import { StaffService, AddNewStaff } from './staff';

@Injectable()
export class ConfigStaffService {
  private configUrl = environment.auth.apiUri;
  postId: string;
  status: string;

  constructor(private http: HttpClient) { }

  getStaff() {
    return this.http
      .get<Staff[]>(this.configUrl + '/staff/retrieveStaff')
      .pipe(map(data => data),
        catchError(this.handleError));
  }

  async getAllStaff () {
    return this.http.get(this.configUrl + '/staff/retrieveStaff');
  }
  async _getStaffRota() {

    return await this.http.get(this.configUrl + '/staff/getStaffRota');
  }

  async _getStaffRoleType() {

    return await this.http.get(this.configUrl + '/roles/retrieveStaffRoleTypes');
  }

  addNewStaffMemeber(newStaff: AddNewStaff): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(newStaff);
    return this.http.post(this.configUrl + '/staff', body, { 'headers': headers })
  }


  async _addProduct (data) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/product/newProduct', data, { 'headers': headers })
  }

  async _updateProduct (data) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/product/updateProduct', data, { 'headers': headers })
  }

  async _getProducts () {
    
    return await this.http.get(environment.auth.apiUri+'/product/retrieveProducts');
  }

  async _getServices () {
    
    return await this.http.get(environment.auth.apiUri+'/services/retrieveServices');
  }

  async _getServiceCategory () {
    
    return await this.http.get(environment.auth.apiUri+'/services/getServiceCategories');
  }

  async _deleteProducts (id: any) {
    
    return await this.http.get(environment.auth.apiUri+'/product/deleteProduct?productId='+id);
  }

  async _getColourList () {

    return await this.http.get(environment.auth.apiUri+'/services/getServiceCategoryColour');
  }

  async _getCategoryList () {

    return await this.http.get(environment.auth.apiUri+'/services/getServiceCategories');
  }

  async _addServiceCategory (data) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/services/newServiceCategory', data, { 'headers': headers })
  }

  async _updateServiceCategory (data: any) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/services/updateServiceCategory', data, { 'headers': headers })
  }

  async _createVoucher (data: any) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/voucher/addNewVoucher', data, { 'headers': headers })
  }

  async _deleteServiceCategory (id: any) {
    
    return await this.http.get(environment.auth.apiUri+'/services/deleteServiceCategory?categoryId='+id);
  }

  async _createCharge (data) {

    const headers = { 'Cache-Control': 'no-cache'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/stripe/create-charge', data , { 'headers': headers })
  }

  async _addService (data) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/services/newService', data, { 'headers': headers })
  }

  async _updateService (data) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    return this.http.post(this.configUrl + '/services/updateService', data, { 'headers': headers })
  }

  async _deleteService (service_id: any) {

    return await this.http.get(environment.auth.apiUri+'/services/deleteService?serviceId='+service_id);
  }

  async _getServiceList () {

    return await this.http.get(environment.auth.apiUri+'/services/retrieveServices');
  }

  async _addStaff (data: any) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.post(this.configUrl + '/staff/newStaff', body, { 'headers': headers })
  }

  async _addClient(data: any) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.post(this.configUrl + '/user/addUser', body, { 'headers': headers })
  }

  async _updateClient(email: string , data: any) {

    const headers = { 'content-type': 'application/json-patch+json'  };
    // const body = JSON.stringify(data);

    console.log('body--' , data)
    return this.http.post(this.configUrl + '/user/updateUserDetails?email='+email, data ,{ 'headers': headers })
  }

  async _updateStaff(data) {

    const headers = { 'content-type': 'application/json' }
 
    return this.http.post(this.configUrl + '/staff/updateStaff', data ,{ 'headers': headers })

  }

  async _addStaffRota (data) {

    const headers = { 'content-type': 'application/json' };
 
    return await this.http.post(this.configUrl + '/staff/addStaffRota', data ,{ 'headers': headers })    
  }

  async _updateStaffRota (data) {

    const headers = { 'content-type': 'application/json' };
    console.log('json --data' , data)
 
    return await this.http.post(this.configUrl + '/staff/updateStaffRota', data ,{ 'headers': headers })    
  }

  async _deleteRota (data) {
    const headers = { 'content-type': 'application/json' };
 
    return await this.http.post(this.configUrl + '/staff/deleteStaffRota', data ,{ 'headers': headers })
  }

  async _addClientNote (data) {
    const headers = { 'content-type': 'application/json' };

    return await this.http.post(this.configUrl + '/user/addNote', data ,{ 'headers': headers })
  } 

  async _updateClientNote (data) {
    const headers = { 'content-type': 'application/json' };

    return await this.http.post(this.configUrl + '/user/updateClientNotes', data ,{ 'headers': headers })
  } 

  async _deleteClientNote (id) {
    const headers = { 'content-type': 'application/json' }
      return await this.http.get(this.configUrl + '/user/deleteClientNote?noteId=' + id , { 'headers': headers })
  } 

  async _getClientTransactionList () {

    const headers = { 'content-type': 'application/json' }
      return await this.http.get(this.configUrl + '/transaction/retrieveTransactions' , { 'headers': headers })
  } 

  async _deleteClientTransaction (id) {
    const headers = { 'content-type': 'application/json' }
      return await this.http.get(this.configUrl + '/user/deleteTransaction?transactionId=' + id , { 'headers': headers })
  } 

  updateStaffMember(updateStaff: AddNewStaff) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(updateStaff);
    this.http.put<Staff>(this.configUrl + 'staff/' + updateStaff.id, updateStaff)
      .subscribe(data => this.postId = data.id);
  }

  async deleteStaff(staffID) {
    
    const headers = { 'content-type': 'application/json' }
      return await this.http.get(this.configUrl + '/staff/removeStaff?id=' + staffID , { 'headers': headers })
  }

  updateStaffServices(newStaffservices: StaffService) {
    
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(newStaffservices);
    return this.http.post(this.configUrl + 'staffServices', body, { 'headers': headers })
  }

  getStaffServices() {
    return this.http
      .get<StaffService[]>(this.configUrl + "/services/retrieveServices")
      .pipe(map(data => data),
        catchError(this.handleError));
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