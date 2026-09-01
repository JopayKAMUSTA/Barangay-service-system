import { Routes } from '@angular/router';
import { Register} from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { DocumentRequest} from './document-request/document-request';
import { MyRequest } from './my-request/my-request';
import { AdminRequests } from './admin-requests/admin-requests';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminResident } from './admin-resident/admin-resident';
import { AdminReports } from './admin-reports/admin-reports';
import { MyProfile } from './my-profile/my-profile';
import { Announcement } from './announcement/announcement';
import { AdminAnnouncement } from './admin-announcement/admin-announcement';
import { ResidentLayout } from './layout/resident-layout/resident-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: 'register',
        component: Register
    },

    {
        path:'',
        component: AdminLayout,
        canActivate: [adminGuard],

        
        children:[

            {
                path: 'admin-dashboard',
                component: AdminDashboard
            },

            {
                path:'admin-request',
                component: AdminRequests
            },

            {
                path: 'admin-reports',
                component: AdminReports
            },

            {
                path: 'admin-resident',
                component: AdminResident
            },

            {
                path: 'admin-announcement',
                component: AdminAnnouncement
            }
        ]
    },


    {
        path: '',
        component: ResidentLayout,
        canActivate: [authGuard],


        children: [

            {
                path: 'dashboard',
                component: Dashboard
            },

            {
                path: 'document-request',
                component: DocumentRequest
            },

            {
                path: 'my-request',
                component: MyRequest
            },

            {
                path: 'my-profile',
                component: MyProfile
            },

            {
                path:'announcement',
                component: Announcement
            }
        ]
    }
]