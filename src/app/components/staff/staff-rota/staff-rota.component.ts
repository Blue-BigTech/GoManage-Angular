import { Component, OnInit ,ViewChild,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-staff-rota',
  templateUrl: './staff-rota.component.html',
  styleUrls: ['./staff-rota.component.css']
})
export class StaffRotaComponent implements OnInit {

  WEEKLY_START: Date = new Date (); 
 
  WEEKLY_END: Date = new Date ();
  MESSAGE_MODEL_OPEN: boolean = false;

  DAYS_LIST: any = ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thu' , 'Fri' , 'Sat'];
  MONTH_LIST: any = ['January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'Decemeber'];

  HOURS_LIST: any = ['00','01','02' ,'03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  MINUTES_LIST: any = ['00','05','10','15','20','25','30','35','40','45','50' , '55' , '59'];
  WEEK_DAYS_LIST: any = [];
  STAFF_LIST: any = [];
  ROTA_LIST: any = [];
  ROTA_RESPONSE: any = [];
  LIST: any = [];
  MODEL_OPEN: boolean  = false;
  MESSAGE_MODEL_TEXT: string = '';
  STAFF_MEMBER: string = '';
  
  SELECTED_DATE: string = ''
  EDITABLE_DATE: string = ''
  SHIFT_START: any = '';
  SHIFT_START_HOUR: any = '00';
  SHIFT_START_MINUT: any = '00';

  FIRST_SHIFT_ID: any = '';
  SECOND_SHIFT_ID: any = '';
  SHFT_DELETE_IDS: any = [];

  SHIFT_END: string = '';
  SHIFT_END_HOUR: string = '00';
  SHIFT_END_MINUT: string = '00';
  
  BREAK_START: string = '';
  BREAK_START_HOUR: string = '00';
  BREAK_START_MINUT: string = '00';

  BREAK_END: string = '';
  BREAK_END_HOUR: string = '00';
  BREAK_END_MINUT: string = '00';
  IS_WORKING_UNTILL_CLOSE : boolean = false;

  IS_FIRST_ROTA: boolean = false;
  EDITABLE_ROTA_DATA: any = [];
  DELETEABLE_ROTA: any = [];
  MAX_REPEATABLE_WEEK: any = 2;
  INVALID_TIME_FORMAT: string = '';
  
  STAFF_ID: string = '';
  WORK_DAY_ID: number ;
  NEW_ROTA_ARRAY: any = [];
  TOTAL_NEW_ROTA: number = 1;
  LAST_UPDATE_BUTTON_INDEX: number = 0;
  CURRENT_ACTIVE_BUTTON_INDEX: number = 0;
  IS_SAVE_BUTTON: boolean = false;


  REPEAT_CHECK: boolean = false;
  FULL_DAY_OFF: boolean = false;
  SICK_TRAINING: any = [
    {name: "None" , value:""},
    {name: "Holiday" , value:"Holiday"},
    {name: "Sick days" , value:"Sick days"},
    {name: "Training days" , value:"Training days"},
  ];

  BUTTONS_LIST: any = [
      { id:1 ,name: 'Working Day' , value:'' , status: true , colour: '#453666' , disabled_colour: '#d3cedf'},
      { id:2 ,name: 'Training Day' , value:'Training Day' , status: false ,colour: '#e96d36' , disabled_colour: '#e1c8bd'},
      { id:3 ,name: 'Sick Day' , value:'Sick Day' , status: false ,colour: '#e96d36' , disabled_colour: '#e1c8bd'},
      { id:4 ,name: 'Annual Leave' , value:'Annual Leave' , status: false , colour: '#e96d36' , disabled_colour: '#e1c8bd'},
    ];
  

  constructor(
    private route: Router,
    private staffService: ConfigStaffService,
    private commanService: CommanService,
    private changeDetection: ChangeDetectorRef,
    private configStaffService :ConfigStaffService,
    private spinner: NgxSpinnerService
  ) {

    this._gettingCuurentWeeksName();
   }

  ngOnInit(): void {

  }

  async _changeButton (index: any) {

    for ( let button_value of this.BUTTONS_LIST)  button_value.status = false;
    this.BUTTONS_LIST[index]['status'] = true;
    this.CURRENT_ACTIVE_BUTTON_INDEX = index;
    this.IS_SAVE_BUTTON = this.LAST_UPDATE_BUTTON_INDEX != index ? true : false;
    this.changeDetection.detectChanges();

  }

  async _saveButton() {

    //if (!this.IS_SAVE_BUTTON)return;
    let active_button = await this.BUTTONS_LIST.filter(data => data.status == true);
    if (active_button.length > 0) {

      this.LAST_UPDATE_BUTTON_INDEX = active_button[0].id - 1;
    }
    
    this.IS_SAVE_BUTTON = false;
    this.changeDetection.detectChanges();
    
    let editabale_shift = [];
    let deleteable_rota = [];
    let new_rota = [];
    let update_rota = [];
    this.INVALID_TIME_FORMAT = '';

    for (let staff of this.LIST) {

      for (let day_list of staff.list) {

        for (let shift of day_list.work_detail_list) {

          if (shift.is_editable) {
            shift.employeeId =  staff.employee_id

            if (shift.start_time == '' && shift.end_time == '' && shift.hasOwnProperty('work_day_id')) {

              deleteable_rota.push(shift.work_day_id);
              
            } else {

              if (shift.hasOwnProperty('work_day_id')) {
                
                let data =  {
                  id:shift.work_day_id,
                  employeeId : staff.employee_id,
                  startShiftTime : this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? `${shift.start_time != '' ? shift.start_time : '00:00'}:00` :  '00:00:00',
                  endShiftTime : this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? `${shift.end_time != '' ? shift.end_time : '00:00'}:00` :  '00:00:00',
                  outOfOfficeFrom :"00:00:00",
                  outOfOfficeTo :"00:00:00",
                  workDate :shift.date,
                  miscEventStartTime :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] != '' ? `${shift.start_time != '' ? shift.start_time : '00:00'}:00` :  '00:00:00',
                  miscEventEndTime :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] != '' ? `${shift.end_time != '' ? shift.end_time : '00:00'}:00` :  '00:00:00',
                  outsideBooking :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? false : true ,
                  description :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'],
                }

                update_rota.push(data);
              } else {
                let data =  {
                              employeeId : staff.employee_id,
                              startShiftTime : this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? `${shift.start_time != '' ? shift.start_time : '00:00'}:00` :  '00:00:00',
                              endShiftTime : this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? `${shift.end_time != '' ? shift.end_time : '00:00'}:00` :  '00:00:00',
                              outOfOfficeFrom :"00:00:00",
                              outOfOfficeTo :"00:00:00",
                              workDate :shift.date,
                              miscEventStartTime :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] != '' ? `${shift.start_time != '' ? shift.start_time : '00:00'}:00` :  '00:00:00',
                              miscEventEndTime :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] != '' ? `${shift.end_time != '' ? shift.end_time : '00:00'}:00` :  '00:00:00',
                              outsideBooking :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'] == '' ? false : true ,
                              description :this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'],
                            }
                
                new_rota.push(data);
              }
              editabale_shift.push(shift);

              let [start_hours , start_minut ] = shift.start_time.trim().split(':');
              let [end_hours , end_minut ] = shift.end_time.trim().split(':');

              let regx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

              if (regx.test(`${start_hours}:${start_minut}`) == false || regx.test(`${end_hours}:${end_minut}`) == false){
      
                this.INVALID_TIME_FORMAT = 'Invalid time format';
                this.changeDetection.detectChanges();
                break;
              }

              start_hours = start_hours.trim();
              start_minut = start_minut.trim();
              end_hours = end_hours.trim();
              end_minut = end_minut.trim();

              let start_timing = (parseInt(start_hours) * 60) + parseInt(start_minut);
              let end_timing = (parseInt(end_hours) * 60) + parseInt(end_minut);
              
              if (end_timing < start_timing) {

                this.INVALID_TIME_FORMAT ="End timing can't be less than start timing";
                break;
              }
            }
            
          }
        }

        if (this.INVALID_TIME_FORMAT != '') break;
      }
      if (this.INVALID_TIME_FORMAT != '') break;
    }

    if (this.INVALID_TIME_FORMAT != '') {

      this.changeDetection.detectChanges();
      return
    }

    
    if (deleteable_rota.length > 0) {

      
      await (await this.configStaffService._deleteRota(deleteable_rota)).subscribe(
        (response: any) => {
  
        },
        async (error: any) => {
  
  
          if (error.status == 200) {
            if (new_rota.length == 0 && update_rota.length == 0) {
              
              this.LIST = [];
              this.spinner.show();
              this._getStaffRotaList();
            }
            await this.changeDetection.detectChanges();
          }
        }
      );
    }

    if (new_rota.length > 0) {

      await (await this.configStaffService._addStaffRota(new_rota)).subscribe(
        (response: any) => {
        },
        async (error: any) => {
  
          if (error.status == 200) {

            

            if (update_rota.length == 0) {

              //this.LIST = [];
              // this.spinner.show();
              // this._getStaffRotaList();
              this.MESSAGE_MODEL_TEXT = "Rota updated successfully";
              setTimeout(async () => {
                this.MESSAGE_MODEL_OPEN = true;
                await this.changeDetection.detectChanges();
              }, 500);
            } else {

              await (await this.configStaffService._updateStaffRota(update_rota)).subscribe(
                (response: any) => {
                },
                async (error: any) => {
          
                  if (error.status == 200) {
                    this.LIST = [];
                    this.spinner.show();
                    this._getStaffRotaList();
                    await this.changeDetection.detectChanges();
                  }
                }
              );
            }
            
            await this.changeDetection.detectChanges();
          }
          //alert('backend-service error')
        }
      );
    } else if (update_rota.length > 0) {

      await (await this.configStaffService._updateStaffRota(update_rota)).subscribe(
        (response: any) => {
  
          
        },
        async (error: any) => {
  
          if (error.status == 200) {
  
            
            this.LIST = [];
            this.spinner.show();
            this._getStaffRotaList();
            await this.changeDetection.detectChanges();
          }
        }
      );
    }

    this.changeDetection.detectChanges();
    return

    
  }

  async _deleteShift (shift_id: any) {

    let deleteable_rota = [shift_id];
    await (await this.configStaffService._deleteRota(deleteable_rota)).subscribe(
      (response: any) => {

      },
      async (error: any) => {


        if (error.status == 200) {

            this.LIST = [];
            this.spinner.show();
            this._getStaffRotaList();
          
          await this.changeDetection.detectChanges();
        }
      }
    );
  }
  async _setPreviousSelectButton () {

    for ( let button_value of this.BUTTONS_LIST)  button_value.status = false;
    this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['status'] = true;
    this.IS_SAVE_BUTTON = false;
    this.changeDetection.detectChanges();
  }

  async _selectDateRangePicker (date_value: any) {

    
    let [start_date , end_date] = date_value.text.split(' - ');

   
    let [start_date_day , start_date_month , start_date_year] = start_date.split('/');
    let [end_date_day , end_date_month , end_date_year] = end_date.split('/');

    
    start_date = `${start_date_year}/${start_date_month}/${start_date_day}`;
    end_date = `${end_date_year}/${end_date_month}/${end_date_day}`;

    this.spinner.show();

    let all_dates = await this._getDatesArrayFromTo(start_date , end_date);

    this.WEEK_DAYS_LIST = [];
    this.LIST = [];

    for (let value of all_dates ) {
      let curr = new Date(value) 
      
      let day = new Date(curr).toISOString().slice(0, 10)
      let day_number = new Date(day).getDay();
      let year = curr.getFullYear();

      let month = Number(curr.getMonth())+1 < 10 ? '0'+(Number(curr.getMonth())+1) : (Number(curr.getMonth())+1);

      let date = curr.getDate() < 10 ? '0'+curr.getDate() : curr.getDate();

      let full_date = year+'-'+month+'-'+date;
      
      let date_string = new Date(day).getDate().toString();

      if (new Date(day).getDate() == 1 ) {

        date_string += 'st';
      } else if(new Date(day).getDate() == 2) {
        
        date_string += 'nd';
      } else {
        
        date_string += 'th';
      }

      date_string += ` ${this.MONTH_LIST[Number(month)-1]} ${year}`;

      this.WEEK_DAYS_LIST.push( { date_value: new Date(day).getDate() + ' ' +  this.DAYS_LIST[day_number]  , date: day , dull_date : full_date , date_string : date_string})
      
    }

    this.changeDetection.detectChanges();
    
    this._getStaffRotaList();
   }

   
   

  _openModel(staff_id: any , value: any , day: any , work_detail_list: any) {



    this.EDITABLE_ROTA_DATA = work_detail_list;
    this.REPEAT_CHECK = false;
    this.MAX_REPEATABLE_WEEK = 2;

    this.changeDetection.detectChanges();

    this.NEW_ROTA_ARRAY = [];
    
    if (value.is_closed) {
      
      this.NEW_ROTA_ARRAY.push ({
                                  work_day_id: 0,
                                  shift_start_hour: '00',
                                  shift_start_minut: '00',
                                  shift_end_hour: '00',
                                  shift_end_minut: '00',
                                  break_start_hour: '00',
                                  break_start_minut: '00',
                                  break_end_hour: '00',
                                  break_end_minut: '00',
                                  untill_close: false,
                                  is_deleted: false,
                                  index_number: 1,
                                  is_sick_or_taining_day: this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value']
                                });
    } else {

      let index_number = 1;
      for (let rota of work_detail_list) {

        let [shift_start_hour , shift_start_minut] = rota.start_time.split(':');
        let [shift_end_hour , shift_end_minut] = rota.end_time.split(':');
        

        this.NEW_ROTA_ARRAY.push(
          {
            work_day_id: rota.work_day_id,
            shift_start_hour: shift_start_hour,
            shift_start_minut: shift_start_minut,
            shift_end_hour: shift_end_hour,
            shift_end_minut: shift_end_minut,
            break_start_hour: rota.break_start_hour,
            break_start_minut: rota.break_start_minut,
            break_end_hour: rota.break_end_hour,
            break_end_minut: rota.break_end_minut,
            untill_close: false,
            is_deleted: false,
            index_number: index_number++,
            //is_sick_or_taining_day: rota.description == 'null' || rota.description == '' ? '' : rota.description,
            is_sick_or_taining_day: this.BUTTONS_LIST[this.LAST_UPDATE_BUTTON_INDEX]['value'],
          });
      }

      
      
      
    }

    this.SHIFT_START = '';
    this.SHIFT_END = '';
    this.BREAK_START = '';
    this.BREAK_END = '';

    this.SHIFT_START_HOUR = '';
    this.SHIFT_START_MINUT = '';

    this.SHIFT_END_HOUR = '';
    this.SHIFT_END_MINUT = '';
    
    this.IS_WORKING_UNTILL_CLOSE = false;

    let select_day = this.WEEK_DAYS_LIST.filter( data => data.date_value == day);
    let selected_staff = this.LIST.filter( data => data.employee_id == staff_id);

    this.SELECTED_DATE = select_day[0].date_string;
    this.STAFF_MEMBER = selected_staff[0].firstName + ' ' + selected_staff[0].lastName;
    
    this.STAFF_ID = selected_staff[0].employee_id;
    this.EDITABLE_DATE = value.date;
    this.WORK_DAY_ID = value.work_day_id;

    this.MODEL_OPEN = true;
    this.changeDetection.detectChanges();
   }

   async _deleteRotaIndex (index) {

    this.NEW_ROTA_ARRAY[index].is_deleted = true;

    let index_number = 1;
    
    for (let rota of this.NEW_ROTA_ARRAY) {
      
      if (!rota.is_deleted) {
        rota.index_number = index_number ++;
      }
    }

  

    this.changeDetection.detectChanges();
   }

   _closeModel () {

    
    this.MODEL_OPEN = false;
    this.changeDetection.detectChanges();
   }

   

   async _addRota () {

    let get_rota = await this.NEW_ROTA_ARRAY.filter(data => !data.is_deleted);
    

    if (get_rota.length >= 2) return;

    this.NEW_ROTA_ARRAY.push ({
      work_day_id: 0,
      shift_start_hour: '00',
      shift_start_minut: '00',
      shift_end_hour: '00',
      shift_end_minut: '00',
      break_start_hour: '00',
      break_start_minut: '00',
      break_end_hour: '00',
      break_end_minut: '00',
      untill_close: false,
      is_deleted: false,
      index_number: 1,
      is_sick_or_taining_day: ''
    });

    let index_number = 1;
    
    for (let rota of this.NEW_ROTA_ARRAY) {
      
      if (!rota.is_deleted) {
        rota.index_number = index_number ++;
      }
    }

    this.changeDetection.detectChanges();
    
   }

   async _deleteSingleRotaArray (index_value: number) {

    let new_array = [];

    for(let index in this.NEW_ROTA_ARRAY) {

      if (index_value.toString() != index.toString() ) {

        new_array.push(this.NEW_ROTA_ARRAY[index]);
      }
    }

    this.NEW_ROTA_ARRAY = new_array;
    
   }
   

   async _gettingCuurentWeeksName () {

    this.spinner.show();
    let curr = new Date() 
    let week = []

    for (let i = 0; i <= 6; i++) {
      let first = curr.getDate() - curr.getDay() + i 
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      let day_number = new Date(day).getDay();

      let year = curr.getFullYear();
      let month = curr.getMonth() < 11 ? '0'+(Number(curr.getMonth())+1) : Number(curr.getMonth())+1;
      let date = curr.getDate() < 10 ? '0'+curr.getDate() : curr.getDate();

      let full_date = year+'-'+month+'-'+date;


      let date_string = new Date(day).getDate().toString();

      if (new Date(day).getDate() == 1 ) {

        date_string += 'st';
      } else if(new Date(day).getDate() == 2) {
        
        date_string += 'nd';
      } else {
        
        date_string += 'th';
      }

      date_string += ` ${this.MONTH_LIST[Number(month)-1]} ${year}`;

      this.WEEK_DAYS_LIST.push( { date_value: new Date(day).getDate() + ' ' +  this.DAYS_LIST[day_number]  , date: day , dull_date : full_date , date_string : date_string})
      
    }

    this.WEEKLY_START = new Date (this.WEEK_DAYS_LIST[0].date);
    this.WEEKLY_END = new Date (this.WEEK_DAYS_LIST[this.WEEK_DAYS_LIST.length - 1].date);

    this._getStaffRotaList();

   }

   async _addFormValue (index , key , value) {

      this.NEW_ROTA_ARRAY[index][key] = value;

      if (key == 'is_sick_or_taining_day') {

        let is_shift_off = await this.NEW_ROTA_ARRAY.filter(data => data.is_sick_or_taining_day != '');
        
        if (is_shift_off.length > 0) {

          this.REPEAT_CHECK = false;
          this.FULL_DAY_OFF = false;
        }
      }

      await this.changeDetection.detectChanges();
   }

   async _changeRepeatCheck () {

    // If any shift is selected as a holiday or sick day or training day then repeat functionality will not work
    let is_shift_off = await this.NEW_ROTA_ARRAY.filter(data => data.is_deleted);
        
        if (is_shift_off.length > 0 && this.REPEAT_CHECK) {

          alert('Repeat functionality will not add if any shift is selected as a Holiday or  sick day or training day')
          this.REPEAT_CHECK = false;
        }

   

    await this.changeDetection.detectChanges();
  }

  async _changeFullDayOff () {

    for (let shift of this.NEW_ROTA_ARRAY) shift.is_sick_or_taining_day = 'Holiday';
    
    await this.changeDetection.detectChanges();
  }

   async _getStaffRotaList () {


    await this.staffService.getStaff().subscribe(
      async (response: any) => {

        this.STAFF_LIST = response;


        await (await this.staffService._getStaffRota()).subscribe(
          async (staff_rota_response: any) => {
            
            this.ROTA_RESPONSE = staff_rota_response;
            
            for(let staff of this.STAFF_LIST) {

              let staff_rota_list = [];
              let total_minutes = 0;
              
              for(let index in this.WEEK_DAYS_LIST) {


                let work_day_detail = await staff_rota_response.filter( data => data.employeeId == staff.employee_id && this.WEEK_DAYS_LIST[index].date == data.workDate);


                if (work_day_detail.length > 0) {

                  let current_work_detail_array = [];

                  for (let current_work_detail of work_day_detail) {

                    let [start_hour , start_minut , start_second  ]= current_work_detail.startShiftTime.split(':');
                    let [end_hour , end_minut , end_second  ]= current_work_detail.endShiftTime.split(':');

                    current_work_detail.outOfOfficeFrom = current_work_detail.outOfOfficeFrom == null ? '00:00:00' : current_work_detail.outOfOfficeFrom;
                    current_work_detail.outOfOfficeTo = current_work_detail.outOfOfficeTo == null ? '00:00:00' : current_work_detail.outOfOfficeTo;

                    let [break_start_hour , break_start_minut , break_start_second  ]= current_work_detail.outOfOfficeFrom.split(':');
                    let [break_end_hour , break_end_minut , break_end_second  ]= current_work_detail.outOfOfficeTo.split(':');

                    let [leave_start_hour , leave_start_minut , leave_start_second  ]= current_work_detail.miscEventStartTime.split(':');
                    let [leave_end_hour , leave_end_minut , leave_end_second  ]= current_work_detail.miscEventEndTime.split(':');

                    if (current_work_detail.description == '') {

                      if (current_work_detail.outOfOfficeFrom == '00:00:00' || current_work_detail.outOfOfficeTo == '00:00:00') {

                        var diff_miliseconds = Math.abs(<any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${start_hour}:${start_minut}`) - <any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${end_hour}:${end_minut}`));
                        let diff_minutes = Math.floor((diff_miliseconds/1000)/60);
                        total_minutes += diff_minutes;
                        
                      } else  {
                        var first_half_miliseconds = Math.abs(<any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${start_hour}:${start_minut}`) - <any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${break_start_hour}:${break_start_minut}`));
                        let first_half_minutes = Math.floor((first_half_miliseconds/1000)/60);
                        
                        var second_half_miliseconds = Math.abs(<any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${break_end_hour}:${break_end_minut}`) - <any>new Date(`${this.WEEK_DAYS_LIST[index].date}T${end_hour}:${end_minut}`));
                        let second_half_minutes = Math.floor((second_half_miliseconds/1000)/60);

                        total_minutes += first_half_minutes + second_half_minutes;
                      }
                      
                      
                    }

                    let get_color = await this.BUTTONS_LIST.filter( data => data.value == current_work_detail.description);
                    

                    let data = { 
                      day_name_value: this.WEEK_DAYS_LIST[index].date_value, 
                      work_day_id: current_work_detail.id , 
                      date: this.WEEK_DAYS_LIST[index].date , 
                      is_closed: false , 
                      time: `${start_hour}:${start_minut} - ${end_hour}:${end_minut}`,
                      start_time: `${start_hour}:${start_minut}`,
                      end_time: `${end_hour}:${end_minut}`,
                      break_start: `${break_start_hour}:${break_start_minut}`,
                      break_end: `${break_end_hour}:${break_end_minut}`,
                      break_start_hour: break_start_hour,
                      break_start_minut: break_start_minut,
                      break_end_hour: break_end_hour,
                      break_end_minut: break_end_minut,
                      is_editable: false,
                      description: current_work_detail.description,
                      miscEventStartTime: `${leave_start_hour}:${leave_start_minut}`,
                      miscEventEndTime: `${leave_end_hour}:${leave_end_minut}`,
                      outsideBooking: current_work_detail.outsideBooking,
                      background_color: get_color.length > 0 ?  get_color[0].colour : '#453666'
                    };
                   
                    current_work_detail_array.push(data);
                    
                  }

                  let is_full_day_off = await current_work_detail_array.filter( data => data.description == '' || data.description == 'null' || data.description == null );

                  staff_rota_list.push ({
                    date: this.WEEK_DAYS_LIST[index].date , 
                    is_full_day_off: is_full_day_off.length > 0 ? false : true,
                    work_detail_list : current_work_detail_array
                  
                  });
                  
                } else {

                  
                  staff_rota_list.push ( {
                                          date: this.WEEK_DAYS_LIST[index].date , 
                                          is_full_day_off : false, 
                                          work_detail_list : [{ 
                                          day_name_value: this.WEEK_DAYS_LIST[index].date_value , 
                                          date: this.WEEK_DAYS_LIST[index].date , 
                                          is_closed: true,
                                          start_time: '00:00',
                                          end_time: '00:00',
                                          is_editable: false,
                                         
                                          }]
                                        }
                                      )
                }
              }
              staff.total_minutes = total_minutes;
              staff.total_no_of_hours = Math.floor(total_minutes/60);
              staff.total_no_of_minutes = total_minutes%60;
              staff.list = staff_rota_list;

              this.LIST.push(staff)
              
            }

            this.spinner.hide();
            this.changeDetection.detectChanges();

          },

          (staff_error: any) => {

            this.spinner.hide();
          }
        );


      },
      (error: any) => {
        this.spinner.hide();
      }

    );
   }

   async _openEditable (staff_index: any , rota_index: any , schedule_index: any) {
    
    this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['is_editable'] = true;
    this.changeDetection.detectChanges();
   }

   async _change_timing (event: any , time_key: string , staff_index: any , rota_index: any) {

    this.LIST[staff_index].list[rota_index][time_key]
    
    this.LIST[staff_index].list[rota_index][time_key] = event.target.value;

   }

  async _deleteRota (staff_index: any , rota_index: any ,  schedule: any){

    this.LIST[staff_index].list[rota_index]['is_closed'] = true;
    this.LIST[staff_index].list[rota_index]['is_editable'] = false;
    this.LIST[staff_index].list[rota_index]['start_time'] = '00:00';
    this.LIST[staff_index].list[rota_index]['end_time'] = '00:00';
    
    this.changeDetection.detectChanges();
  }

  async _cancelRotaEdit (staff_index: any , rota_index: any) {

    this.LIST[staff_index].list[rota_index]['is_editable'] = false;
    this.changeDetection.detectChanges();
  }

  async _isClosingChange (index: any , check_value : any) {

    let end_time = await this.commanService.BUSENESS_CLOSING_TIME;
    let [hour , minut] = end_time.split(':');

      this.NEW_ROTA_ARRAY[index].shift_end_hour = hour;
      this.NEW_ROTA_ARRAY[index].shift_end_minut = minut;
      this.NEW_ROTA_ARRAY[index].untill_close = check_value;
   
    this.changeDetection.detectChanges();
  }

  async _rotaInfoUpdate(timing: string , staff_index: any , rota_index: any , schedule: any , employee_id: any , schedule_index :  any) {

    
    if (timing == '') {

      if (schedule.hasOwnProperty('work_day_id')) {
        
        this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['start_time']= '';
        this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['end_time'] = '';

        
      } else {

        this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['start_time']= '';
        this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['end_time'] = '';
        return
      }
    } else {

      if (timing.split('-').length != 2) {
        //this.INVALID_TIME_FORMAT = true;
        this.changeDetection.detectChanges();
        return;
      }

      let [starting_time , ending_time] = timing.split('-');

      this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['start_time']= starting_time.trim();
      this.LIST[staff_index].list[rota_index]['work_detail_list'][schedule_index]['end_time'] = ending_time.trim();
      
      return;
    }
    
  }

  async _hideInvalidTimeError () {

    this.INVALID_TIME_FORMAT = '';
    await this.changeDetection.detectChanges();

  }

  async _saveSingleRota (staff_index: any , rota_index: any , schedule: any , employee_id: any) {

    let start_time = this.LIST[staff_index].list[rota_index]['start_time'];
    let end_time = this.LIST[staff_index].list[rota_index]['end_time'];

    if (start_time == '00:00' && end_time == '00:00') {

      alert('Please enter a valid timing');
      return;
    }

    let [start_hours , start_minut ] = start_time.split(':');
    let [end_hours , end_minut ] = end_time.split(':');

    let start_timing = (parseInt(start_hours) * 60) + parseInt(start_minut);
    let end_timing = (parseInt(end_hours) * 60) + parseInt(end_minut);

    if (end_timing < start_timing) {

      alert("end timing can't be less than start timing");
      return;
    }

    this.LIST[staff_index].list[rota_index]['time'] = `${start_time} - ${end_time}`;
    this.LIST[staff_index].list[rota_index]['is_editable'] = false;
    this.LIST[staff_index].list[rota_index]['is_closed'] = false;
    this.changeDetection.detectChanges();

    if (schedule.hasOwnProperty('work_day_id')) {

      let data = [{
        id: schedule.work_day_id,
        employeeId : employee_id,
        startShiftTime: `${start_time}:00`,
        endShiftTime: `${end_time}:00`,
        outOfOfficeFrom: "14:00:00",
        outOfOfficeTo: "15:00:00",
        workDate : schedule.date
      }];

      await (await this.configStaffService._updateStaffRota(data)).subscribe(
        (response: any) => {
          
        },
        async (error: any) => {
  
          if (error.status == 200) {
  
            this.LIST = [];
            this.spinner.show();
            this._getStaffRotaList();
            await this.changeDetection.detectChanges();
          }
        }
      );
      
    } else {

      let data = [{
        employeeId : employee_id,
        startShiftTime: `${start_time}:00`,
        endShiftTime: `${end_time}:00`,
        outOfOfficeFrom: "14:00:00",
        outOfOfficeTo: "15:00:00",
        workDate : schedule.date
      }];

      
      await (await this.configStaffService._addStaffRota(data)).subscribe(
        (response: any) => {
  
          alert('Rota updated successfully')
        },
        async (error: any) => {
  
          if (error.status == 200) {
          
            // this._closeModel();
            this.LIST = [];
            this.spinner.show();
            this._getStaffRotaList();
            await this.changeDetection.detectChanges();
          }
          //alert('backend-service error')
        }
      );
    }

    
  }



   async _updateRota () {
    

    console.log('this.NEW_ROTA_ARRAY-------' , this.NEW_ROTA_ARRAY);

    if (this.NEW_ROTA_ARRAY.length > 0) {

      let is_passed = true;

      for (let value of this.NEW_ROTA_ARRAY) {

          value.shift_start = value.shift_start_hour == '00' && value.shift_start_minut == '00' ? '' : `${value.shift_start_hour}:${value.shift_start_minut}`;
          value.shift_end = value.shift_end_hour == '00' && value.shift_end_minut == '00' ? '' : `${value.shift_end_hour}:${value.shift_end_minut}`;
          value.break_start = value.break_start_hour == '00' && value.break_start_minut == '00' ? '' : `${value.break_start_hour}:${value.break_start_minut}`;
          value.break_end = value.break_end_hour == '00' && value.break_end_minut == '00' ? '' : `${value.break_end_hour}:${value.break_end_minut}`;

          let time = `${value.shift_start_hour}:${value.shift_start_minut}-${value.shift_end_hour}:${value.shift_end_minut}`;
          

        if (time != '00:00-00:00'  && !value.is_deleted) {

            if (value.shift_start ==  value.shift_end ) {
             
              is_passed = false;
            }
        }
      }

      if (!is_passed) {

        alert("star and end time can't be same");
        return;
      }
    } 

   

    let deleted_rota = this.NEW_ROTA_ARRAY.filter( data => data.work_day_id != 0 && data.is_deleted);
    let updated_rota = this.NEW_ROTA_ARRAY.filter( data => data.work_day_id != 0 && !data.is_deleted );
    let new_rota = this.NEW_ROTA_ARRAY.filter( data => data.work_day_id == 0 && !data.is_deleted && data.shift_start != '' && data.shift_end != ''); 
    
    let new_delete_rota = await updated_rota.filter( data => data.shift_start == '' && data.shift_end == '');// blank will treat as deleted shift
    updated_rota = await updated_rota.filter( data => data.shift_start != '' && data.shift_end != '');// blank will treat as deleted shift
    console.log('new dele---' , new_delete_rota)
    deleted_rota = [...deleted_rota, ...new_delete_rota];
    console.log('deleted_rota' , deleted_rota)
    console.log('updated_rota' , updated_rota)
    console.log('new_rota' , new_rota)
    //return

    if (deleted_rota.length == 0 && updated_rota.length == 0 && new_rota.length == 0) {
      await this._closeModel();
      this.LIST = [];
      this.spinner.show();
      this._getStaffRotaList();
      return
    }

    let new_rota_array = [];
    let update_rota_array = [];
    let delete_rota_array = [];

    if (new_rota.length > 0) {

      for(let rota_info of new_rota) {

        new_rota_array.push(
          {
            employeeId: this.STAFF_ID,
            startShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
            endShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
            outOfOfficeFrom: rota_info.break_start != '' ? `${rota_info.break_start}:00` : null,
            outOfOfficeTo: rota_info.break_end != '' ? `${rota_info.break_end}:00` : null,
            workDate: this.EDITABLE_DATE,
            miscEventStartTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
            miscEventEndTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
            outsideBooking: rota_info.is_sick_or_taining_day == '' ? false : true,
            description: rota_info.is_sick_or_taining_day
          }
        );
      }
    }

    

    if (this.REPEAT_CHECK) {

      update_rota_array = [];
      new_rota_array = [];
      
      let all_repeatable_dates = [this.EDITABLE_DATE]
      for (let i = 1; i<= this.MAX_REPEATABLE_WEEK -1; i++) {
        var today = new Date(this.EDITABLE_DATE);
        today.setDate(today.getDate()+(i*7))

        let year = today.getFullYear();
        let month = (today.getMonth()+1) < 10 ? '0'+(today.getMonth()+1) : (today.getMonth()+1);
        let day = today.getDate() < 10 ? "0"+today.getDate() : today.getDate();
        all_repeatable_dates.push(`${year}-${month}-${day}`)

      }

      let deletable_rota = await this.ROTA_RESPONSE.filter(data =>  all_repeatable_dates.indexOf(data.workDate) !== -1 && this.STAFF_ID == data.employeeId);

      if (deletable_rota.length > 0) {

        for (let rota of deletable_rota) {

          delete_rota_array.push(rota.id);
        }
      }

      let non_deleted_rota = this.NEW_ROTA_ARRAY.filter( data =>  !data.is_deleted);

      for (let new_date of all_repeatable_dates) {

        for(let rota_info of non_deleted_rota) {

          new_rota_array.push(
            {
              employeeId: this.STAFF_ID,
              startShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
              endShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
              outOfOfficeFrom: rota_info.break_start != '' ? `${rota_info.break_start}:00` : null,
              outOfOfficeTo: rota_info.break_end != '' ? `${rota_info.break_end}:00` : null,
              workDate: new_date,
              miscEventStartTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
              miscEventEndTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
              outsideBooking: rota_info.is_sick_or_taining_day == '' ? false : true,
              description: rota_info.is_sick_or_taining_day
            }
          );
        }
      }
      
    }

    

    if (updated_rota.length > 0 && !this.REPEAT_CHECK) {

      for(let rota_info of updated_rota) {

        update_rota_array.push(
          {
            id: rota_info.work_day_id,
            employeeId: this.STAFF_ID,
            startShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
            endShiftTime: rota_info.is_sick_or_taining_day != '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
            outOfOfficeFrom: rota_info.break_start != '' ? `${rota_info.break_start}:00` : null,
            outOfOfficeTo: rota_info.break_end != '' ? `${rota_info.break_end}:00` : null,
            workDate: this.EDITABLE_DATE,
            miscEventStartTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_start}:00`,
            miscEventEndTime: rota_info.is_sick_or_taining_day == '' ? '00:00:00' :  `${rota_info.shift_end}:00`,
            outsideBooking: rota_info.is_sick_or_taining_day == '' ? false : true,
            description: rota_info.is_sick_or_taining_day
          }
        );
      }
    }

    if (deleted_rota.length > 0 && !this.REPEAT_CHECK){

      for (let rota_info of deleted_rota){

        delete_rota_array.push(rota_info.work_day_id)
      }
    }

    if (delete_rota_array.length > 0) {

      await (await this.configStaffService._deleteRota(delete_rota_array)).subscribe(
        (response: any) => {
  
  
        },
        async (error: any) => {
  
  
          if (error.status == 200) {
  
            if (new_rota.length == 0 && updated_rota.length == 0) {

              //alert("Rota deleted successfully")
              this.MESSAGE_MODEL_TEXT = 'Rota deleted successfully';
              await this._closeModel();
              setTimeout(async () => {
                this.MESSAGE_MODEL_OPEN = true;
                await this.changeDetection.detectChanges();
              }, 500);
              
              // this.LIST = [];
              // this.spinner.show();
              // this._getStaffRotaList();
            }
            
            await this.changeDetection.detectChanges();
          }
        }
      );
    }

    
    if (update_rota_array.length == 0 &&  new_rota_array.length == 0) return;

    if (update_rota_array.length == 0) {

        await this._addRotaData(new_rota_array);
        return
    }

    

    await (await this.configStaffService._updateStaffRota(update_rota_array)).subscribe(
      (response: any) => {
        
      },
      async (error: any) => {

        if (error.status == 200) {

          if (new_rota_array.length == 0) {
            //alert('Rota updated successfully')
            this.MESSAGE_MODEL_TEXT = "Rota updated successfully";
            await this._closeModel();

            setTimeout(async () => {
              this.MESSAGE_MODEL_OPEN = true;
              await this.changeDetection.detectChanges();
            }, 500);
            

            // this.LIST = [];
            // this.spinner.show();
            // await this._getStaffRotaList();
          } else {
            this._addRotaData(new_rota_array);
          }
        }
      }
    );
    
 }

  async _addRotaData(data: any) {

    await (await this.configStaffService._addStaffRota(data)).subscribe(
      (response: any) => {

        alert('Rota updated successfully')
      },
      async (error: any) => {

        if (error.status == 200) {

          
          //alert('Rota added successfully');
          this.MESSAGE_MODEL_TEXT = "Rota updated successfully";
          await this._closeModel();
          setTimeout(async () => {
            this.MESSAGE_MODEL_OPEN = true;
            await this.changeDetection.detectChanges();
          }, 500);
          //this.LIST = [];
          
          //await this._getStaffRotaList();
        }
        //alert('backend-service error')
        
      }
    );
  }

  async _closeMessageModel() {

    this.MESSAGE_MODEL_OPEN = false;
    this.LIST = [];
    await this.spinner.show();
    await this._getStaffRotaList();
    await this.changeDetection.detectChanges();
  }

  _getDatesArrayFromTo (start , end) {

    let list = [];

    for(var a=[],d=new Date(start);d<=new Date(end);d.setDate(d.getDate()+1)){ 

      let year = d.getFullYear();
      let month = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
      let day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate();
      list.push(`${year}-${month}-${day}`)
     
    }
    return list;
   }

}
