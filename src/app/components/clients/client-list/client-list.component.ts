import { Component, OnInit, OnDestroy ,ViewChild,ChangeDetectorRef } from '@angular/core';
import { ClientsService } from 'app/config/config.service.clients';

import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CommanService } from 'app/config/comman.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigStaffService } from 'app/config/config.staff.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  LIST = [];
  
 
  RESPONSE: any = [];
  ACTIVE_BUTTON: boolean = false;
  INACTIVE_BUTTON: any = false;
  SEARCH_TEXT: string = '';
  FILTER_SHOW: boolean = true;
  SEARCH_TEXT_TIMEOUT: any ;
  MODEL_OPEN: boolean = false;
  MESSAGE_MODEL_OPEN: boolean = false;
  ADD_NOTE_DATE: string = '';
  ADD_NOTE_COMMENT: string = '';

  ADD_TRANSACTION_DATE: string = '';
  ADD_TRANSACTION_SERVICES: string = '';
  ADD_TRANSACTION_PRICE: string = '';

  MESSAGE_MODEL_TEXT: string = '';
  NOTES: boolean = true;
  TRANSACTION: boolean = false;
  REVIEWS: boolean = false;
  POP_EMAIL: string = '';
  POP_NAME: string = '';
  POP_CLIENT_ID: string = '';
  CLIENT_NOTES: any = [];
  CLIENT_TRANSACTION: any = [];
  CLIENT_REVIEWS: any = [
    { id: 1 , date: '15/09/2022' , time: '20:38' , comment: " great service today" , rating: 4, status: false},
    { id: 2 , date: '15/09/2022' , time: '20:38' , comment: " Long time waiting  for appointment today" , rating: 2,status: false},
    { id: 3 , date: '15/09/2022' , time: '20:38' , comment: " Hello testing" , rating: 1, status: false},
    { id: 4 , date: '15/09/2022' , time: '20:38' , comment: " Hello testing" , rating: 5, status: false},
  ]
;
  SPINNER_TEXT: string = 'Loading...';

  NOTES_LIST: any = [];

  TRANSACTION_LIST: any = [];


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings =  {
    pagingType: 'full_numbers',
    pageLength: 20,
    order:[[0 , 'desc']],
    //ordering: false,
    searching: false,
    //lengthChange: false,
    lengthMenu : [5 , 10, 20 ,30 , 40],
    processing: true
  };
  dtTrigger: Subject<any> = new Subject();

  
  
  constructor (
    private clientService: ClientsService,
    private staffService: ConfigStaffService,
    private commanService: CommanService,
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
   
    ){
      
      
      this._getClients();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

    this.FILTER_SHOW = false;
    this.changeDetection.detectChanges();
    this.FILTER_SHOW = false;
    

   // this.dtTrigger.unsubscribe();
  }

 
  
  // async _reinitiateTable() {

    

  //   this.dtOptions = {
  //       pagingType: 'full_numbers',
  //       pageLength: 5,
  //       //ordering: false,
  //       // searching: false,
  //       // lengthChange: false,
  //       // scrollX : true,
  //       lengthMenu : [5, 20, 25],
  //       processing: true
  //     };
    
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

  //       // Destroy the table first
  //       dtInstance.destroy();
        
  //       // Call the dtTrigger to rerender again
  //       setTimeout(() => {
  //         this.dtTrigger.next();
  //       }, 4000); 
  //     }).then(()=>{

     

  //      });
  // }


  async _getClients () {

    this.SPINNER_TEXT = 'Loading...';
    await this.spinner.show();

     ( await this.clientService.getClients()).subscribe(
        async (response: any) => {

            for (let value of response) {

                value.status = true;
            }

            this.changeDetection.detectChanges();
            this.LIST = response;
            
            this.RESPONSE = response

            
            this.dtTrigger.next();
            this.changeDetection.detectChanges();
            await this.spinner.hide();
        },
        async (error: any) => {

            //await this.spinner.hide();
            
        }
    );

  }

  async _searchBar () {

    clearTimeout(this.SEARCH_TEXT_TIMEOUT);
    this.SEARCH_TEXT_TIMEOUT = setTimeout( () => {
      this._filterData();
    }, 300);
  }

  async _showUser (email: string) {

    

    let user = await this.LIST.filter(data => data.email == email);
    
    if (user.length > 0){

      this.POP_EMAIL = user[0].email;
      this.POP_NAME = user[0].givenName+" "+user[0].familyName;
      this.POP_CLIENT_ID = user[0].userGMID;
    }

    this.ADD_NOTE_DATE = await  this._getCurrentDateTime();
    console.log('this.ADD_NOTE_DATE---' ,this.ADD_NOTE_DATE);
    

    await this._getClientNotes(user.length > 0 ? user[0].userGMID : 0);
    
    await this._getTrnasction();

    this.MODEL_OPEN = true;

    this.changeDetection.detectChanges();
  }

  async _getCurrentDateTime () {

    var currentdate = new Date(); 

    let year = currentdate.getFullYear();
    let month = (currentdate.getMonth()+1) < 10 ? "0"+(currentdate.getMonth()+1) : (currentdate.getMonth()+1);
    let date =  currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate();
    let hour = currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours();
    let minutes = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
    let seconds = currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds();

    return await `${year}-${month}-${date}T${hour}:${minutes}:${seconds}`;
  }

  async _getTrnasction () {

    // let get_local_transaction: any = await localStorage.getItem('transaction_list');

    // if (get_local_transaction == undefined || get_local_transaction == null) {

    //   localStorage.setItem('transaction_list' , JSON.stringify([]))          
    // }

    // get_local_transaction = await JSON.parse(localStorage.getItem('transaction_list'));
    // this.TRANSACTION_LIST = get_local_transaction.reverse();

    // for (let value of this.TRANSACTION_LIST){

    //   value.date_time = `${value.date}T${value.time}`; 

    // }

    this.changeDetection.detectChanges();

    await (await this.staffService._getClientTransactionList()).subscribe(
      async (response:  any) => {

        console.log('this.TRANSACTION_LIST------response' , this.POP_CLIENT_ID ,response);
        this.TRANSACTION_LIST  = await response.filter(data => data.client_id == this.POP_CLIENT_ID);

        this.TRANSACTION_LIST = this.TRANSACTION_LIST.reverse()
        
        for (let value of this.TRANSACTION_LIST){

          value.transaction_date = value.transaction_date.split(' ').join('T'); 

        }

        console.log('this.TRANSACTION_LIST------' , this.TRANSACTION_LIST);

        this.changeDetection.detectChanges();
      }, 
      (error: any) => {

        this.CLIENT_NOTES = [];
      }
    );
  } 


  async _getClientNotes (client_id) {

    
    //client_id = 312;
    await (await this.clientService._getClientNotes()).subscribe(
      async (response:  any) => {


        this.CLIENT_NOTES  = await response.filter(data => data.clientId == this.POP_CLIENT_ID);

        this.CLIENT_NOTES = this.CLIENT_NOTES.reverse()
        
        for (let value of this.CLIENT_NOTES){

          value.date_time = `${value.date}T${value.time}`; 

        }

        console.log('this.CLIENT_NOTES---' , this.CLIENT_NOTES)

        //this.CLIENT_NOTES = response;
        this.changeDetection.detectChanges();
      }, 
      (error: any) => {

        this.CLIENT_NOTES = [];
      }
    );
  }

  

  async _filterData () {

    
    this.changeDetection.detectChanges();
    if (!this.ACTIVE_BUTTON && !this.INACTIVE_BUTTON && this.SEARCH_TEXT == '') {

        this.LIST = this.RESPONSE;
        
    } else if (!this.ACTIVE_BUTTON && !this.INACTIVE_BUTTON && this.SEARCH_TEXT != ''){

        
        this.LIST = this.RESPONSE.filter( data => 
                    (((data.hasOwnProperty('email') && data.email != undefined) ? data.email.toLocaleLowerCase() : '').indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) 
                    || (((data.hasOwnProperty('familyName') && data.familyName != undefined)) ? data.familyName.toLocaleLowerCase() : '').indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1
                    || (((data.hasOwnProperty('givenName') && data.givenName != undefined)) ? data.givenName.toLocaleLowerCase() : '').indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1
                    || (((data.hasOwnProperty('phoneMobile') && data.phoneMobile != undefined)) ? data.phoneMobile.toLocaleLowerCase() : '').indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1
                    
                    );
        
    } else if (this.ACTIVE_BUTTON && this.SEARCH_TEXT != '') {

        this.LIST = this.RESPONSE.filter( data => ((data.email.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) && data.status == true);
        
    } else if (this.INACTIVE_BUTTON && this.SEARCH_TEXT != '') {

        this.LIST = this.RESPONSE.filter( data => ((data.email.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) && data.status == false);
    } else if (this.ACTIVE_BUTTON && this.SEARCH_TEXT == '') {

        this.LIST = this.RESPONSE.filter( data => data.status == true);
        
    } else if (this.INACTIVE_BUTTON && this.SEARCH_TEXT == '') {

        this.LIST = this.RESPONSE.filter( data => data.status == false);
    }  


    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      dtInstance.destroy();
      
      this.dtTrigger.next(); // Call the dtTrigger to rerender again
       
    }).then(async ()=>{

     });
  }

  async _activeButtonFilter (){

    this.ACTIVE_BUTTON =! this.ACTIVE_BUTTON;

    if (this.ACTIVE_BUTTON) {

        this.INACTIVE_BUTTON = false;
    }

    await this._filterData();
  }

  async _inActiveButtonFilter (){

    this.INACTIVE_BUTTON =! this.INACTIVE_BUTTON;

    if (this.ACTIVE_BUTTON) {

        this.ACTIVE_BUTTON = false;
    }
    
    await this._filterData();
  }


  async _deleteUser (email: string) {
        
    if (confirm('Are you sure ? you want to delete this user.')) {

        this.SPINNER_TEXT = 'Deleting...';
        await this.spinner.show();

        await (await this.clientService._deleteClient(email)).subscribe(
            (response: any) => {

            },
            async (error: any) => {

                if (error.status == this.commanService.SUCCESS_CODE) {
                  await this.spinner.hide();
                    
                    this.MESSAGE_MODEL_TEXT = "Client deleted successfully !"
                    this.MESSAGE_MODEL_OPEN = true;
                    this.changeDetection.detectChanges(); 
                    

                    
                    // this.LIST = [];
                    // this.RESPONSE = [];
                    // this.FULL_RESPONSE = [];

                    // await this._getClients();
                } else{

                    if (<any>(String(email)
                    .toLowerCase()
                    .match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) == 'null') {

                        alert('email is not valid')
                    } else {


                        alert('Something went wrong on server side. Please try again later')
                        this.spinner.hide();
                        this.changeDetection.detectChanges(); 
                    }
                }

            }
        );
    }
    
  }

  async _closeModel () {

    this.ADD_NOTE_DATE = '';
    this.ADD_NOTE_COMMENT = '';
    this.ADD_TRANSACTION_DATE = '';
    this.ADD_TRANSACTION_SERVICES = '';
    this.MODEL_OPEN = false;
    this.changeDetection.detectChanges(); 
  }

  async _closeMessageModel () {

    this.MESSAGE_MODEL_OPEN = false;
    this.changeDetection.detectChanges(); 
    setTimeout(() => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

        // Destroy the table first
        dtInstance.destroy();
        
        // Call the dtTrigger to rerender again
        // setTimeout(() => {
        //   this.dtTrigger.next();
        // }, 4000); 
      }).then(async ()=>{
        await this._getClients()

       });
    }, 200);
  }

  async _changeTabs (number: any) {

    this.NOTES = false;
    this.TRANSACTION = false;
    this.REVIEWS = false;

    if (number == 1) this.NOTES = true;
    if (number == 2) this.TRANSACTION = true;
    if (number == 3) this.REVIEWS = true;
    this.changeDetection.detectChanges();
  }

  


  async _addNote() {

    if (this.ADD_NOTE_DATE == '' || this.ADD_NOTE_COMMENT == '') {

      alert('field can\'t be empy')
      return;
    }

    let [date , time] = this.ADD_NOTE_DATE.split('T');

    let data = {

      clientId: this.POP_CLIENT_ID,
      date: date , 
      time: time ,
      comment: this.ADD_NOTE_COMMENT,
      status: true,
    };


    await (await this.staffService._addClientNote(data)).subscribe(
      async (response:  any) => {

      },
      async (error: any) => {

        if (error.status == 200) {

          this.ADD_NOTE_DATE = '';
          this.ADD_NOTE_COMMENT = '';
          this.changeDetection.detectChanges();

          this._showUser(this.POP_EMAIL);
        } else {

          alert('server error occurred')
        }
        
      }

    );

    
    

  }

  async _noteInputChange (note_id , index , key_name , value) {

    this.CLIENT_NOTES[index][key_name] = value;

    
    let data = [
                  {
                      "id":note_id,
                      "clientId": 1051,
                      "comment": "Updated Client Note"
                  }
               ];

  }

  async _transactionInputChange (transaction_id , index , key_name , value) {

    
    this.TRANSACTION_LIST[index][key_name] = value.replace('€','');;
  }


  // async _addTransaction () {

  //   let [date , time] = this.ADD_TRANSACTION_DATE.split('T');

  //   if (this.ADD_TRANSACTION_DATE == '' || this.ADD_TRANSACTION_SERVICES == '' || this.ADD_TRANSACTION_PRICE == '') {

  //     alert('field can\'t be empy')
  //     return;
  //   }

  //   let get_user = await this.LIST.filter(data => data.email == this.POP_EMAIL);
  //   let get_local_transaction = await JSON.parse(localStorage.getItem('transaction_list'));

  //   get_local_transaction.push({

      
  //     date: date , 
  //     time: time ,
  //     services_name: this.ADD_TRANSACTION_SERVICES,
  //     price: this.ADD_TRANSACTION_PRICE,
  //     id: Date.now() + Math.random(),
  //     status: true,
  //   });

  //   await localStorage.setItem('transaction_list' , JSON.stringify(get_local_transaction));

  //   // let data = {

  //   //   clientId: get_user.length > 0 ? get_user[0].userGMID : 0,
  //   //   date_time: date,
  //   //   services_name : this.ADD_TRANSACTION_SERVICES,
  //   //   time: time+":00"
  //   // }

  //   this.ADD_TRANSACTION_SERVICES = '';
  //   this.ADD_TRANSACTION_DATE = '';
  //   this.ADD_TRANSACTION_PRICE = '';

  //   this._getTrnasction()
  // }

  // async _updateTransaction (id: any) {

  //   return
  //   let get_transaction = await this.TRANSACTION_LIST.filter( data => data.id == id);
    
  //   let get_local_transaction = await JSON.parse(localStorage.getItem('transaction_list'));

  //   for (let value of get_local_transaction) {

  //     if (value.id == id) {

  //       let [date , time] = get_transaction[0].date_time.split('T');


  //       value.date = date;
  //       value.time = time;
  //       value.services_name = get_transaction[0].services_name;
  //       value.price = get_transaction[0].price.replace('€','');
  //     }
  //   }

  //   localStorage.setItem('transaction_list' , JSON.stringify(get_local_transaction));
  //   this._getTrnasction()
  // }


  async _updateNote(note_id : any) {

    
    let get_note = await this.CLIENT_NOTES.filter( data => data.id == note_id);

    let update_data = [{
      id: note_id,
      clientId: this.POP_CLIENT_ID,
      comment: get_note.length > 0 ? get_note[0].comment : '',
    }];

    await (await this.staffService._updateClientNote(update_data)).subscribe(
      async (response:  any) => {

      },
      async (error: any) => {

        if (error.status == 200) {

          this._showUser(this.POP_EMAIL);
        } else {

          alert('server error occurred')
        }
      }

    );

    
  }

  async _deleteTranaction (id) {

    return;

    if (confirm("Are you sure? you want to delete this transaction")) {

      
      this.TRANSACTION_LIST = await this.TRANSACTION_LIST.filter(data => data.id != id);

      // let get_local_transaction = await JSON.parse(localStorage.getItem('transaction_list'));
      // get_local_transaction = await get_local_transaction.filter( data => data.id != id);

      // localStorage.setItem('transaction_list' , JSON.stringify(get_local_transaction));
    
      await (await this.staffService._deleteClientTransaction(id)).subscribe(
        async (response:  any) => {
  
        },
        async (error: any) => {
  
          if (error.status == 200) {
  
            this._showUser(this.POP_EMAIL);
          } else {
  
            alert('server error occurred')
          }
        }
  
      );
      return

    }
  }

  async _deleteNote (id: any) {

    if (confirm("Are you sure? you want to delete this note")) {

      
      this.CLIENT_NOTES = await this.CLIENT_NOTES.filter(data => data.id != id);
    
      this.changeDetection.detectChanges(); 
      
      await (await this.staffService._deleteClientNote(id)).subscribe(
        async (response:  any) => {
  
        },
        async (error: any) => {
  
          if (error.status == 200) {
  
            this._showUser(this.POP_EMAIL);
          } else {
  
            alert('server error occurred')
          }
        }
  
      );

    }
    

    
  }
}
