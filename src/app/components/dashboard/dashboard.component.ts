import { Component, ViewChild  , ViewEncapsulation} from '@angular/core';
import { addClass, remove, createElement, Ajax } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import {
  EventSettingsModel, View, ResourceDetails, TreeViewArgs, GroupModel, PopupOpenEventArgs, ScheduleComponent, CurrentAction,
  RenderCellEventArgs, ActionEventArgs, CellClickEventArgs, WorkHoursModel, Schedule, EJ2Instance
} from '@syncfusion/ej2-angular-schedule';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { ConfigService } from '../../config/config.service';
import { Bookings } from '../../config/employees';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { Staff, StaffService } from 'app/config/staff';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';
import { TextBox } from '@syncfusion/ej2-inputs';
import { interval, Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'dashboard-cmp',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent {
  @ViewChild('treeObj') public treeObj: TreeViewComponent;
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  @ViewChild("addButton") public addButton: ButtonComponent;

  public isTreeItemDropped = false;
  public draggedItemId = '';
  public profileImageUrl; string: any;
  public group: GroupModel = {
    resources: ['Employees']
  };

  saveNewBooking: Bookings = {};
  bookingData: Record<string, any>[] = [];

  private dateTime = new Date()
  public selectedDate: Date = new Date(this.dateTime.getFullYear(), this.dateTime.getMonth(), this.dateTime.getDate());
  public currentView: View = 'Week';
  public workHours: WorkHoursModel = { start: '8:00', end: '18:00' };
  public workWeekDays: number[] = [2, 3, 4, 5, 6];
  public allowResizing = true;
  public allowDragDrop = true;
  public onAppointmentDrag = false;
  staffServices: StaffService[] = [];
  public servicesList: string[] = [];
  public SERVICE_CATEGORY_LIST: string[] = [];
  error: any;
  staffData: Staff[] = [];
  temp = true;
  serviceDuration = 15;
  public showQuickInfo: Boolean = true;
  public showHeaderBar = true;
  public allowMultipleEmployees: Boolean = true;
  private selectionTarget: Element;

  public resourceDataSource: Record<string, any>[] = [
    {
      name: "Jade", id: 1, color: "#3f51b5", workDays: [2, 3, 4, 5, 6], startHour: "09:00", endHour: "18:00",
      availableTime: [
        //different appointment time with color
        { startTime: "12:30", endTime: "13:00", color: "orange" }
      ]
    },
    {
      name: "Rossy", id: 2, color: "red", workDays: [1, 3, 5, 7], startHour: "09:00", endHour: "18:00",
      availableTime: [
        //different appointment time with color
        { startTime: "10:30", endTime: "12:00", color: "red" }
      ]
    },
    {
      name: "Jonathan", id: 3, color: "blue", workDays: [2, 4, 5], startHour: "09:00", endHour: "18:00",
      availableTime: [
        //different appointment time with color
        { startTime: "10:30", endTime: "12:00", color: "blue" }
      ]
    },
    {
      name: "Petterson", id: 4, color: "green", workDays: [1, 2, 4, 5], startHour: "09:00", endHour: "18:00",
      availableTime: [
        //different appointment time with color
        { startTime: "10:30", endTime: "12:00", color: "green" }
      ]
    }
  ]

  getStaff() {
    this.staffService.getStaff()
      .subscribe(staffData => {
        this.staffData = staffData;
      });
  }

  getStaffServices() {
    this.staffService.getStaffServices()
      .subscribe(data => {
        var counter = 0;
        for (let [key, value] of Object.entries(data)) {
          this.servicesList.push(value.serviceName);
          this.staffServices.push(value)
          counter++;
        }
      });
  }
  async getStaffCategories() {
    await (await this.staffService._getServiceCategory()).subscribe(
      async (response: any ) => {
        for (let category of response){
          this.SERVICE_CATEGORY_LIST.push(category.categoryName);
        }
      },
      async (error: any) => {
      }
    );
    console.log(this.SERVICE_CATEGORY_LIST)
  }

  getBookings() {
    const check = this.schedularService.getBookings()
      .subscribe(bookings => {
        this.bookingData = bookings;
      });

    return check
  }

  public eventSettings: EventSettingsModel = {
    dataSource: this.resourceDataSource,
    fields: {
      subject: { title: 'First Name', name: 'firstName', validation: { required: true } },
      location: { title: 'Last Name', name: 'lastName', validation: { required: true } },
      startTime: { title: 'From', name: 'startTime', validation: { required: true } },
      endTime: { title: 'To', name: 'endTime', validation: { required: true } },
      description: { title: 'Notes', name: 'description' },
    }
  };

  onCellClick(args: CellClickEventArgs): void {
    this.scheduleObj.closeQuickInfoPopup();   // To programmatically close the quick popup 
    this.scheduleObj.openEditor(args, 'Add');
  }

  constructor(private schedularService: ConfigService, private staffService: ConfigStaffService) {
  }

  public getEmployeeName(value: any) {
    return this.resourceDataSource[value-1].name;
  }
  public getWorkerName(value: ResourceDetails): string {
    return ((value as ResourceDetails).resourceData) ?
      (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string
      : value.resourceName;
  }

  public getWorkerImage(value: any) {
    if ("../../assets/img/staff-profiles/" + value.resourceData.id + ".jpg" && value.resourceData.id) {
      this.profileImageUrl = "../../assets/img/staff-profiles/" + value.resourceData.id + ".jpg";
    } else {
      this.profileImageUrl = "../../assets/img/staff-profiles/0.jpg";
    }
    const resourceName: string = this.profileImageUrl;

    return resourceName;
  }


  public onActionBegin(args: ActionEventArgs): void {
    this.scheduleObj.closeQuickInfoPopup();
    let isEventChange: boolean = (args.requestType === 'eventChange');
    if ((args.requestType === 'eventCreate' && (args.data as Record<string, any>[]).length > 0) || args.requestType === 'eventChange') {

      let eventData: any = !isNullOrUndefined(args.data[0]) ? args.data[0] : args.data;
      let scheduleElement: Element = document.querySelector('.e-schedule');
      let scheduleObj: Schedule = ((scheduleElement as EJ2Instance).ej2_instances[0] as Schedule);
      if (!scheduleObj.isSlotAvailable(eventData.startTime, eventData.endTime))
        args.cancel = true;

      if (!args.cancel || args.requestType === "eventChange") {
        if (args.requestType === "eventCreate") {
          console.log("this",args.addedRecords[0]);
          var sendBooking = [JSON.stringify(this.createBookingsObject(args.addedRecords[0]))];
          sendBooking.push()
          $.ajax({
            url: `${environment.auth.apiUri}/bookings/saveBooking`,
            type: 'POST',
            data: "[" + JSON.stringify(this.createBookingsObject(args.addedRecords[0])) + "]",
            headers: {
              'Content-Type': 'application/json'
            },
          })
        } else if (args.requestType === "eventChange") {
          let schObj = (document.querySelector(".e-schedule") as any)
            .ej2_instances[0];
          const ajax = new Ajax(
            `${environment.auth.apiUri}/bookings/updateBooking`,
            "POST",
            false
          );
          ajax.data = JSON.stringify(this.createBookingsObject(args.changedRecords[0]));

          ajax.onSuccess = (data: any) => {
            schObj.eventSettings.dataSource = JSON.parse(JSON.stringify(data));
          };
          ajax.send();
          this.getBookingsDisplayer();
        }
      } else {
        $('#invalidBookingModal').modal('show');
      }
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
      for (const element of [].slice.call(elements)) {
        remove(element);
      }
    } else if (args.requestType === "eventRemove") {
      this.schedularService.removeBooking(args.deletedRecords[0].id);
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
      this.getBookingsDisplayer()
    }
  }

  public isValidateTime(startDate: Date, endDate: Date, resIndex: number): boolean {
    var staffDetails = this.scheduleObj.getResourceCollections()[0].dataSource;
    for (let [key, value] of Object.entries(staffDetails)) {
      if (value.id === resIndex) {
        const startHour: number = parseInt(value.startHour.toString().slice(0, 2), 10);
        const endHour: number = parseInt(value.endHour.toString().slice(0, 2), 10);

        if (startHour <= startDate.getHours() && endHour >= endDate.getHours()) {
          return false;
        } else {
          return true
        }
      }
    }
    return true;
  }

  public isTimeSlotAvailible(startDate: Date, endDate: Date,): boolean {
    var processedCellData = this.scheduleObj.eventsProcessed;
    for (let [key, value] of Object.entries(processedCellData)) {
      if ((startDate.getTime() <= value.startTime.getTime() && endDate.getTime() >= value.startTime.getTime()) ||
        (startDate.getTime() <= value.endTime.getTime() && endDate.getTime() >= value.endTime.getTime()) ||
        (startDate.getTime() >= value.startTime.getTime() && endDate.getTime() <= value.endTime.getTime())) {

        return false;
      }
    }
    return true;
  }

  onRenderCell(args: RenderCellEventArgs) {
    if (!args.element.classList.contains("e-work-hours") && !args.element.classList.contains("e-header-cells")
      && !args.element.classList.contains("e-time-cells") && !args.element.classList.contains("e-time-slots")
      && !args.element.classList.contains("e-work-days")) {
      (args.element as HTMLElement).style.background = '#d3d3d3';
    }
  }

  showNotification(from, align) {
    var type = ['danger'];

    var color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "pe-7s-gift",
      message: "<b>This Time is not availible to book</b> - Please select a differant time slot."

    }, {
      type: type[color],
      timer: 4000,
      placement: {
        from: from,
        align: align
      }
    });
  }

  private createBookingsObject(newBooking: any) {
    /* TODO
    * This is the mother of all hacks to get over daylight savings 2022/2023
    * Fix soon as possible, will fail in 2023 winter daylight savings
    */
    let daylightsavingsforward = 1;
    if (newBooking.startTime.getTime() > 1667084400000 && newBooking.startTime.getTime() < 1679788800000) {
      daylightsavingsforward = 0;
    }

    this.saveNewBooking.employeeId = !(newBooking.employeeId === undefined) ? newBooking.employeeId : null;
    this.saveNewBooking.clientId = !(newBooking.clientId === undefined) ? newBooking.clientId : null;
    this.saveNewBooking.description = !(newBooking.description === undefined || newBooking.description === null) ? newBooking.description : " "
    this.saveNewBooking.endTime = new Date(new Date(newBooking.endTime).setHours(new Date(newBooking.endTime).getHours() + daylightsavingsforward)).toISOString();
    this.saveNewBooking.startTime = new Date(new Date(newBooking.startTime).setHours(new Date(newBooking.startTime).getHours() + daylightsavingsforward)).toISOString();
    this.saveNewBooking.id = newBooking.id;
    this.saveNewBooking.isAllDay = !(newBooking.IsAllDay === undefined) ? newBooking.IsAllDay : null;
    this.saveNewBooking.customer = !(newBooking.location === undefined) ? newBooking.location : null;
    this.saveNewBooking.service = !(newBooking.service === undefined) ? newBooking.service : null;
    this.saveNewBooking.serviceId = this.getServiceID(newBooking.service);
    this.saveNewBooking.firstName = newBooking.firstName;
    this.saveNewBooking.lastName = newBooking.lastName;
    this.saveNewBooking.email = !(newBooking.email === undefined) ? newBooking.email : "";
    this.saveNewBooking.phoneNumber = !(newBooking.phoneNumber === undefined) ? newBooking.phoneNumber : null;

    return this.saveNewBooking;
  }

  getServiceID(serviceName: string) {
    for (let [key, value] of Object.entries(this.staffServices)) {
      if (value.serviceName === serviceName) {
        return value.id;
      }
    }
    return;
  }

  getServiceDuration(staffServices) {
    const serviceName = $("#serviceSelected").val();

    try {
      for (const k in staffServices) {
        if ((staffServices[k].serviceName) === serviceName) {
          this.serviceDuration = staffServices[k].serviceDuration;
          return staffServices[k].serviceDuration;
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  serviceInputEle: HTMLInputElement = createElement('input', {
    className: 'e-field', attrs: { name: 'service' }, id: "serviceSelected"
  }) as HTMLInputElement;
  categoryInputEle: HTMLInputElement = createElement('input', {
    className: 'e-field', attrs: { name: 'category' }, id: "categorySelected"
  }) as HTMLInputElement;

  public onPopupOpen(args: PopupOpenEventArgs): void {
    this.selectionTarget = null;
    this.selectionTarget = args.target;
    const classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
    let isCell = args.target.classList.contains('e-work-cells') || args.target.classList.contains('e-header-cells');
    if (args.type === "QuickInfo" && isCell) {
      args.cancel = true;
    }
    if (args.type === 'Editor') {

      let endObj = (args.element.querySelector('.e-end') as any)
        .ej2_instances[0];
      let startObj = (args.element.querySelector('.e-start') as any)
        .ej2_instances[0];

      // Create required custom elements in initial time
      if (!args.element.querySelector('.custom-field-row')) {
        let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
        let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
        formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
        let container: HTMLElement = createElement('div', { className: 'custom-field-container' });


        container.appendChild(this.categoryInputEle);
        row.appendChild(container);
        let dropDownList: DropDownList = new DropDownList({
          dataSource: this.SERVICE_CATEGORY_LIST,
          fields: { text: 'text', value: 'value' },
          value: args.data.service,
          floatLabelType: 'Always',
          placeholder: 'Category Provided',
        });
        dropDownList.appendTo(this.categoryInputEle);

        formElement.addEventListener('mouseover', (e: Event) => {
          args.duration = this.getServiceDuration(this.staffServices);
          endObj.value = new Date(
            endObj.value.setHours(startObj.value.getHours())
          );
          endObj.value = new Date(
            endObj.value.setMinutes(startObj.value.getMinutes() + this.serviceDuration)
          );
        });
        if (!args.element.querySelector('.custom-field-row3')) {
          let row: HTMLElement = createElement('div', { className: 'custom-field-row3' });
          let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
          let container: HTMLElement = createElement('div', { className: 'custom-field-container3' });
  
  
          container.appendChild(this.serviceInputEle);
          row.appendChild(container);
          let dropDownList: DropDownList = new DropDownList({
            dataSource: this.servicesList,
            fields: { text: 'text', value: 'value' },
            value: args.data.service,
            floatLabelType: 'Always',
            placeholder: 'Service Provided',
          });
          dropDownList.appendTo(this.serviceInputEle);
        }
        if (!args.element.querySelector('.custom-field-row1')) {
          let row: HTMLElement = createElement('div', { className: 'custom-field-row1' });
          let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
          let container: HTMLElement = createElement('div', { className: 'custom-field-container1' });
          let inputEle: HTMLInputElement = createElement('input', {
            className: 'e-field', attrs: { name: 'email' }
          }) as HTMLInputElement;
          container.appendChild(inputEle);
          row.appendChild(container);
          let numeric: TextBox = new TextBox({ placeholder: 'Email Address', value: args.data.email });
          numeric.appendTo(inputEle);
          inputEle.setAttribute('name', 'email');
        }
        if (!args.element.querySelector('.custom-field-row2')) {
          let row: HTMLElement = createElement('div', { className: 'custom-field-row2' });
          let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
          let container: HTMLElement = createElement('div', { className: 'custom-field-container2' });
          let inputEle: HTMLInputElement = createElement('input', {
            className: 'e-field', attrs: { name: 'phoneNumber' }
          }) as HTMLInputElement;
          container.appendChild(inputEle);
          row.appendChild(container);
          let numeric: TextBox = new TextBox({ placeholder: 'Phone Number', value: args.data.phoneNumber });
          numeric.appendTo(inputEle);
          inputEle.setAttribute('name', 'phoneNumber');
        }
        

      }
    }

  }
  public onEditClick(args: any): void {
    if (this.selectionTarget) {
    let eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
    let currentAction: CurrentAction = 'Save';
    if (!isNullOrUndefined(eventData.RecurrenceRule) && eventData.RecurrenceRule !== '') {
        if (args.target.classList.contains('e-edit-series')) {
        currentAction = 'EditSeries';
        eventData = this.scheduleObj.eventBase.getParentEvent(eventData, true);
        } else {
        currentAction = 'EditOccurrence';
        }
    }
    this.scheduleObj.openEditor(eventData, currentAction);
    }
}
public onDeleteClick(args: any): void {
    this.onCloseClick();
    if (this.selectionTarget) {
    const eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
    let currentAction: CurrentAction;
    if (!isNullOrUndefined(eventData.RecurrenceRule) && eventData.RecurrenceRule !== '') {
        currentAction = args.target.classList.contains('e-delete-series') ? 'DeleteSeries' : 'DeleteOccurrence';
    }
    this.scheduleObj.deleteEvent(eventData, currentAction);
    this.getBookingsDisplayer();
    }
}
public onCloseClick(): void {
    this.scheduleObj.quickPopup.quickPopupHide();
}
  public onItemDrag(event: any): void {
    if (this.scheduleObj.isAdaptive) {
      const classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
      if (classElement) {
        classElement.classList.remove('e-device-hover');
      }
      if (event.target.classList.contains('e-work-cells')) {
        addClass([event.target], 'e-device-hover');
      }
    }
    if (document.body.style.cursor === 'not-allowed') {
      document.body.style.cursor = '';
    }
    if (event.name === 'nodeDragging') {
      const dragElementIcon: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag .e-icon-expandable');
      for (const icon of [].slice.call(dragElementIcon)) {
        icon.style.display = 'nodeDragging';
      }
    }
  }

  //method for retrieving and updating calender with new bookings from DB
  onBound(args: any): void {
    if (this.temp) {
      let schObj = (document.querySelector(".e-schedule") as any)
        .ej2_instances[0];
      const ajax = new Ajax(
        `${environment.auth.apiUri}/bookings/retrieveBookings`,
        "GET",
        false
      );

      ajax.onSuccess = (data: any) => {
        schObj.eventSettings.dataSource = JSON.parse(data);
      };
      ajax.send();
      this.temp = false;
    }
  }

  getBookingsDisplayer() {
    let schObj = (document.querySelector(".e-schedule") as any)
      .ej2_instances[0];
    const ajax = new Ajax(
      `${environment.auth.apiUri}/bookings/retrieveBookings`,
      "GET",
      false
    );
    ajax.onSuccess = (data: any) => {
      schObj.eventSettings.dataSource = JSON.parse(data);
    };
    ajax.send();
  }


  ngOnInit() {
    this.getBookings();
    this.getStaff();
    this.getStaffCategories();
    this.getStaffServices();

    //in 60 seconds get bookings data
    interval(60000).subscribe(x => {
      this.getBookingsDisplayer();
    });
  }
}
