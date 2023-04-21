import { Component, OnInit, OnDestroy ,ViewChild  ,ChangeDetectorRef} from '@angular/core';
import { ClientsService } from 'app/config/config.service.clients';

import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CommanService } from 'app/config/comman.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'clients-cmp',
    templateUrl: 'clients.component.html',
    styleUrls: ['clients.component.css']
})

export class ClientsComponent {

    LIST: any = [];

    SHOW_NUM_LIST: any = [ 
                            { name: 5, value: 5, status: true},
                            {name: 10 , value: 10, status: false},
                            {name: 15 , value: 15, status: false},
                            {name: 'All' , value: -1, status: false},
                        ];

    ACTIVE_PER_PAGE_NUMBER: any = 5;
    ACTIVE_PAGINTION_PAGE_NUMBER: any = 1;
    PAGINATION: any = [];
    PRINTABLE_PAGINATION: any = [];
    RESPONSE: any = [];
    ACTIVE_BUTTON: boolean = false;
    INACTIVE_BUTTON: any = false;
    SEARCH_TEXT: string = '';
    SEARCH_TEXT_TIMEOUT: any ;
    REINITIALIZE_DATA_TABLE: any;
    FULL_RESPONSE: any = [];

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    constructor (
        private clientService: ClientsService,
        private commanService: CommanService,
        private changeDetection: ChangeDetectorRef,
        ){

        // console.log('list' , this.LIST)
        // this.RESPONSE = this.LIST;
        // this.dtOptions = {
        //     pagingType: 'full_numbers',
        //     pageLength: 5,
        //     //ordering: false,
        //     searching: false,
        //     lengthChange: false,
        //     lengthMenu : [5, 20, 25],
            
          
        //     processing: true
        //   };
        
        this._getClients();

    }

    
    async _filter (text: any) {

        // await clearTimeout(this.SEARCH_TEXT_TIMEOUT);
        // this.SEARCH_TEXT_TIMEOUT = setTimeout(async () => {
            await this._filterData();
        // }, 300);        
    }

    async _reinitiateTable() {

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            //ordering: false,
            searching: false,
            lengthChange: false,
            scrollX : true,
            lengthMenu : [5, 20, 25],
            processing: true
          };
        
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

            // Destroy the table first
            dtInstance.destroy();
      
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          }).then(()=>{ });
    }

    async _activeButtonFilter (){

        this.ACTIVE_BUTTON =! this.ACTIVE_BUTTON;

        if (this.ACTIVE_BUTTON) {

            this.INACTIVE_BUTTON = false;
        }

        await this._filterData();
        
    }


    async _deleteUser (email: string) {
        
        if (confirm('Are you sure ? you want to delete this user.')) {

            await (await this.clientService._deleteClient(email)).subscribe(
                (response: any) => {
    
                    console.log('response---' , response);
                },
                async (error: any) => {

                    if (error.status == this.commanService.SUCCESS_CODE) {

                        alert('Client delete successfully');
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
                        }

                        
                    }
    
                    console.log('error-----' , error)
                }
            );
        }
        
    }

    async _inActiveButtonFilter (){

        this.INACTIVE_BUTTON =! this.INACTIVE_BUTTON;

        if (this.ACTIVE_BUTTON) {

            this.ACTIVE_BUTTON = false;
        }


        await this._filterData();
        
    }

    async _filterData () {

        if (!this.ACTIVE_BUTTON && !this.INACTIVE_BUTTON && this.SEARCH_TEXT == '') {

            this.RESPONSE = this.FULL_RESPONSE;
            
        } else if (!this.ACTIVE_BUTTON && !this.INACTIVE_BUTTON && this.SEARCH_TEXT != ''){

            console.log('only text---' , this.SEARCH_TEXT)
            this.RESPONSE = this.FULL_RESPONSE.filter( data => ((data.email.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) || (data.familyName.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1);
            console.log('this.LIST----' , this.LIST)
        } else if (this.ACTIVE_BUTTON && this.SEARCH_TEXT != '') {

            this.RESPONSE = this.FULL_RESPONSE.filter( data => ((data.email.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) && data.status == true);
            
        } else if (this.INACTIVE_BUTTON && this.SEARCH_TEXT != '') {

            this.RESPONSE = this.FULL_RESPONSE.filter( data => ((data.email.toLocaleLowerCase()).indexOf(this.SEARCH_TEXT.toLocaleLowerCase()) != -1) && data.status == false);
        } else if (this.ACTIVE_BUTTON && this.SEARCH_TEXT == '') {

            this.RESPONSE = this.FULL_RESPONSE.filter( data => data.status == true);
            console.log('only active without text' , this.RESPONSE)
        } else if (this.INACTIVE_BUTTON && this.SEARCH_TEXT == '') {

            this.RESPONSE = this.FULL_RESPONSE.filter( data => data.status == false);
        }

        
        await this._getPagination();

        // clearTimeout(this.REINITIALIZE_DATA_TABLE);
        
        // this.REINITIALIZE_DATA_TABLE = setTimeout(async() => {
        //     console.log(this.ACTIVE_BUTTON , this.INACTIVE_BUTTON , this.SEARCH_TEXT) 
            
        //     await this._reinitiateTable();
            
        // }, 500);
    }

    async _getClients () {

        //await this.spinner.show();

        await ( await this.clientService.getClients()).subscribe(
            async (response: any) => {

                console.log('response--' , response)

                for (let value of response) {

                    value.status = true;
                }

                console.log('resdd-' , response)

                // this.RESPONSE = response.length > 0 ? response : [];
                this.LIST = response;
                this.RESPONSE = response;
                this.FULL_RESPONSE = response;

                //await this.spinner.hide();
                await this._getPagination();
                

                // setTimeout( async () => {

                //     //this.dtTrigger.next();
                //     await this.spinner.hide();
                //     await this._getPagination();
                //     console.log('done------')
                // }, 1000);
                
                
            },
            (error: any) => {

                 //await this.spinner.hide();
                console.log('error--', error)
            }
        );

    }

    ngOnInit() {
        console.log('oaded---')
      }

    // ngOnDestroy(): void {
    //     this.dtTrigger.unsubscribe();
    //   }

    async _getPagination () {

        await this._getActivePerPageNumber();
        
        let total_number_pages = await this._totalPages_number();

        await this._goToPage(1 , true);

    }

    async _totalPages_number () {

        // get number of pagination of table

        let total_number_pages = (this.RESPONSE.length / this.ACTIVE_PER_PAGE_NUMBER | 0); // remove decimal (a | 0)
        console.log('total page number----------' ,this.RESPONSE.length % this.ACTIVE_PER_PAGE_NUMBER != 0 ? total_number_pages + 1 : total_number_pages)
        return await  this.RESPONSE.length % this.ACTIVE_PER_PAGE_NUMBER != 0 ? total_number_pages + 1 : total_number_pages;
        
    }

    async _getActivePerPageNumber () {

        let amount_per_page = await this.SHOW_NUM_LIST.filter(data => data.status);
        this.ACTIVE_PER_PAGE_NUMBER = amount_per_page[0].value;
        
    }

    async _goToPage (page_no: any , is_click_able: any) {

        
        console.log('page_no--' , this.ACTIVE_PAGINTION_PAGE_NUMBER)
        if (!is_click_able) return true;

        this.ACTIVE_PAGINTION_PAGE_NUMBER = page_no;
        console.log('is_click_able' , page_no , is_click_able)

        let start_differeence = parseInt(page_no) - 1;
        let end_difference = this.PAGINATION.length - parseInt(page_no);

        console.log(start_differeence , end_difference);
        
        let total_number_pages = (this.RESPONSE.length / this.ACTIVE_PER_PAGE_NUMBER | 0); // remove decimal (a | 0)
        total_number_pages = this.RESPONSE.length % this.ACTIVE_PER_PAGE_NUMBER != 0 ? total_number_pages + 1 : total_number_pages;
        
        this.PAGINATION = [];

        for (let i = 0; i < total_number_pages; i++) {
            this.PAGINATION.push({name: i+1 , is_active: i+1 == page_no ? true : false , is_click_able: true})
        }

        this.PRINTABLE_PAGINATION = [];


        if(this.PAGINATION.length < 8){ // If total length less than 8

            for (let i=0; i< this.PAGINATION.length; i++) {

                
                this.PRINTABLE_PAGINATION.push(this.PAGINATION[i])
            }

        }else if (start_differeence <= 2){

            for (let i=0; i< 4; i++) {
                
                this.PRINTABLE_PAGINATION.push(this.PAGINATION[i])
            }

            this.PRINTABLE_PAGINATION.push({name: '...' , is_active:  false , is_click_able: false});
            this.PRINTABLE_PAGINATION.push(this.PAGINATION[this.PAGINATION.length - 1])
        
        } else if (end_difference < 3) {

            this.PRINTABLE_PAGINATION.push(this.PAGINATION[0])
            this.PRINTABLE_PAGINATION.push({name: '...' , is_active:  false , is_click_able: false});

            for (let i = this.PAGINATION.length-5; i < this.PAGINATION.length; i ++){
                this.PRINTABLE_PAGINATION.push(this.PAGINATION[i])
            }
            
        } else if (start_differeence > 2 || end_difference > 3) {

            this.PRINTABLE_PAGINATION.push(this.PAGINATION[0])
            this.PRINTABLE_PAGINATION.push({name: '...' , is_active:  false , is_click_able: false});

            for(let i = (parseInt(page_no)-2); i < (parseInt(page_no)+2); i++){

                this.PRINTABLE_PAGINATION.push(this.PAGINATION[i]);
            }

            this.PRINTABLE_PAGINATION.push({name: '...' , is_active:  false , is_click_able: false});
            this.PRINTABLE_PAGINATION.push(this.PAGINATION[this.PAGINATION.length - 1])
        }

        console.log('this.PRINTABLE_PAGINATION---' , this.ACTIVE_PAGINTION_PAGE_NUMBER , this.PRINTABLE_PAGINATION)
        
        await this._getPageData();
    }

    async _getPageData() {

        let from_index = (this.ACTIVE_PAGINTION_PAGE_NUMBER - 1) * this.ACTIVE_PER_PAGE_NUMBER; // (pagination_number -1) * show_number_per_page
        let to_index = (this.ACTIVE_PAGINTION_PAGE_NUMBER * this.ACTIVE_PER_PAGE_NUMBER) - 1; // (pagination_number -1) * show_number_per_page
        console.log('chekng---' , this.ACTIVE_PAGINTION_PAGE_NUMBER , this.ACTIVE_PER_PAGE_NUMBER)
        console.log('getting array data -----' , from_index , to_index);

        this.changeDetection.detectChanges();
        this.LIST = [];
       

        for (let i = from_index; i <= to_index; i ++) {

            if (this.RESPONSE[i] !== undefined) {

                this.LIST.push(this.RESPONSE[i])
            }
        }

        this.changeDetection.detectChanges();
    }

    async _previous (){

        let total_number_pages = (this.RESPONSE.length / this.ACTIVE_PER_PAGE_NUMBER | 0); // remove decimal (a | 0)
        total_number_pages = this.RESPONSE.length % this.ACTIVE_PER_PAGE_NUMBER != 0 ? total_number_pages + 1 : total_number_pages;

        if (total_number_pages == 0 || this.ACTIVE_PAGINTION_PAGE_NUMBER == 1) return true;

        this.ACTIVE_PAGINTION_PAGE_NUMBER = this.ACTIVE_PAGINTION_PAGE_NUMBER -1;
        await this._goToPage (this.ACTIVE_PAGINTION_PAGE_NUMBER , true);

        console.log('previous---' , this.ACTIVE_PAGINTION_PAGE_NUMBER )
    }

    async _next (){

        let total_number_pages = (this.RESPONSE.length / this.ACTIVE_PER_PAGE_NUMBER | 0); // remove decimal (a | 0)
        total_number_pages = this.RESPONSE.length % this.ACTIVE_PER_PAGE_NUMBER != 0 ? total_number_pages + 1 : total_number_pages;


        if (total_number_pages == 0 || this.ACTIVE_PAGINTION_PAGE_NUMBER == total_number_pages) return true;
        this.ACTIVE_PAGINTION_PAGE_NUMBER = this.ACTIVE_PAGINTION_PAGE_NUMBER + 1;
        await this._goToPage (this.ACTIVE_PAGINTION_PAGE_NUMBER , true);

        console.log('next---' , this.ACTIVE_PAGINTION_PAGE_NUMBER , await this._totalPages_number())
    }
}
