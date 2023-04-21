import { Component } from '@angular/core';

declare var $: any;
//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    is_show: boolean;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
    path: '/dashboard',
    title: 'Appointments',
    type: 'link',
    icontype: 'pe-7s-date',
    is_show: true
}, {
    path: '/staff',
    title: 'Staff',
    type: 'link',
    icontype: 'pe-7s-id',
    is_show: true

}, {
    path: '/clients',
    title: 'Clients',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: true
}, {
    path: '/staff/staff-access',
    title: 'Staff-access',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
}, {
    path: '/staff/finance',
    title: 'Finance',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false,
}, {
    path: '/staff/rota',
    title: 'Rota',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
}, {
    path: '/staff/add',
    title: 'Add Staff',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
}, {
    path: '/staff/edit',
    title: 'Edit Staff',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/clients/add',
    title: 'Add Client',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/clients/edit',
    title: 'Edit Client',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/sales-manager',
    title: 'Sales Manager',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: true
},{
    path: '/sales-manager/product',
    title: '',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/sales-manager/product/add',
    title: 'Add Product',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/sales-manager/product/edit',
    title: 'Edit Product',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},{
    path: '/make-a-sale',
    title: 'Make a Sale',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: true
},{
    path: '/setting',
    title: 'Setting',
    type: 'link',
    icontype: 'pe-7s-settings',
    is_show: true
},
{
    path: '/setting/app-details',
    title: '',
    type: 'link',
    icontype: 'pe-7s-users',
    is_show: false
},

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    styleUrls: ['./sidebar.component.css'],
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        this.menuItems = ROUTES.filter(menuItem => menuItem);

        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }

    ngAfterViewInit() {
        var $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        var collapseId = $sidebarParent.siblings('a').attr("href");

        $(collapseId).collapse("show");
    }
}
