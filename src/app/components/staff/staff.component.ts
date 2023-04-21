
import { Component ,OnInit, OnDestroy ,ViewChild,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';
import {Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    moduleId: module.id,
    selector: 'staff-cmp',
    templateUrl: './staff.component.html',
    styleUrls: ['staff.component.css']
})

export class StaffComponent {

    ADD_STAFF: boolean = false;
    STAFF_LIST: any = [];
    NAME: string = '';
    IMAGE: string = ''
    PERFORMENCE: any = 75;
    SPINNER_TEXT: string = 'Loading...';
    ROLE_TYPES: any = [];

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
        private staffService: ConfigStaffService,
        private route: Router,
        private commanService: CommanService,
        private changeDetection: ChangeDetectorRef,
        private spinner: NgxSpinnerService
        ) {

            
        this._getStaffROleType();
        this._getStaffList();
    }
    
    async _getStaffROleType () {

        await (await this.staffService._getStaffRoleType()).subscribe(
            (respopnse: any) => {
                
                this.ROLE_TYPES = respopnse;
            },
            async (error: any) => {


            }
        );
    }


    async _getStaffList () {

        this.SPINNER_TEXT = 'Loading...';
        
        await this.spinner.show();
        await (await this.staffService.getAllStaff()).subscribe(
            async (respopnse: any) => {

                console.log('response staff list----' , respopnse);

                
                for (let value of respopnse) {

                    let find_staff_role = await this.ROLE_TYPES.filter( data => data.role_id == value['role'])

                    value.role_name = find_staff_role.length > 0 ? find_staff_role[0].roleName : '';
                }
                this.STAFF_LIST = respopnse;
                this.IMAGE = respopnse[0].employeeImg;
                this.NAME = respopnse[0].firstName + " " + respopnse[0].lastName;
                
                this.dtTrigger.next();
                this.spinner.hide();
                this.changeDetection.detectChanges();
                
            },
            (error: any) => {

                alert('Something went wrong on server side. Please try again later')
                this.spinner.hide();
                this.changeDetection.detectChanges();
               
            }
        );
    }

    async _showDetails (staff_id:  any) {
        
        let selected_staff = await this.STAFF_LIST.filter( data => data.employee_id == staff_id);

        this.IMAGE = selected_staff[0].employeeImg;
        this.NAME = selected_staff[0].firstName + " " + selected_staff[0].lastName;
        this.changeDetection.detectChanges();
    }


    ngOnDestroy(): void {
        
        this.changeDetection.detectChanges();
        this.dtTrigger.unsubscribe();
      }

    async _deleteStaff(staff_id: any) {

        if (confirm('Are you sure? you want to delete this user.')) {

           // await this.spinner.show();
            await (await this.staffService.deleteStaff(staff_id)).subscribe(
                (response: any) => {

                },
                async (error: any) => {

                    if (error.status == this.commanService.SUCCESS_CODE) {

                        alert('Staff delete successfully');
                        // this.LIST = [];
                        // this.RESPONSE = [];
                        // this.FULL_RESPONSE = [];
                        
                        
                        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

                            // Destroy the table first
                            dtInstance.destroy();
                            
                            // Call the dtTrigger to rerender again
                            // setTimeout(() => {
                            //   this.dtTrigger.next();
                            // }, 4000); 
                          }).then(async ()=>{
                            await this._getStaffList();
                    
                           });
                       
                        
                    } else{
    
                        alert('Something went wrong on server side. Please try again later')
                       
    
                        
                    }
                }

            )
        }
    }

}

