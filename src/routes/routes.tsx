import { BrowserRouter, Route, Routes } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { Finance, Epi, User, UserPermission } from "@/database/tables";
import ProtectedRoute from "@/routes/protected-route";
import Unauthorized from "@/views/pages/error/unauthorized";
import GuestLayout from "@/views/layout/guest-layout";
import AuthLayout from "@/views/layout/auth-layout";
import LoginPage from "@/views/pages/guest/login-page";
import EpiSuperDashboardPage from "@/views/pages/auth/dashboard/epi/super/epi-super-dashboard-page";
import EpiSuperReportPage from "@/views/pages/auth/report/epi/super/epi-super-report-page";
import EpiProfilePage from "@/views/pages/auth/profile/epi/epi-profile-page";
import FinanceSuperDashboardPage from "@/views/pages/auth/dashboard/finance/super/finance-super-dashboard-page";
import FinanceSuperReportPage from "@/views/pages/auth/report/finance/super/finance-super-report-page";
import FinanceProfilePage from "@/views/pages/auth/profile/finance/finance-profile-page";
import EpiAdminDashboardPage from "@/views/pages/auth/dashboard/epi/admin/epi-admin-dashboard-page";
import UserEditPage from "@/views/pages/auth/users/edit/user-edit-page";
import SettingsPage from "@/views/pages/auth/settings/settings-page";
import ActivityPage from "@/views/pages/auth/activity/activity-page";
import EpiAdminReportPage from "@/views/pages/auth/report/epi/admin/epi-admin-report-page";
import FinanceAdminDashboardPage from "@/views/pages/auth/dashboard/finance/admin/finance-admin-dashboard-page";
import FinanceAdminReportPage from "@/views/pages/auth/report/finance/admin/finance-admin-report-page";
import DebuggerDashboardPage from "@/views/pages/auth/dashboard/debugger/debugger-dashboard-page";
import UsersProfilePage from "@/views/pages/auth/profile/users/users-profile-page";
import UserLoginPage from "@/views/pages/guest/users/user-login-page";
import EpiLoginPage from "@/views/pages/guest/epi/epi-login-page";
import FinanceLoginPage from "@/views/pages/guest/finance/finance-login-page";
import DebuggerAuditPage from "@/views/pages/auth/audit/debugger-audit-page";
import DebuggerLogsPage from "@/views/pages/auth/logs/debugger-logs-page";
import UserPage from "@/views/pages/auth/users/user-page";
import FinanceCertificatePaymentUserPage from "@/views/pages/auth/vaccine/payment/finance/user/finance-certificate-payment-user-page";
import EpiUserVaccineCertificatePage from "@/views/pages/auth/vaccine/certificate/epi/user/epi-user-vaccine-certificate-page";

export const getEpiSuperRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<EpiSuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<EpiSuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<UserEditPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<EpiSuperReportPage />}
                routeName="reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<EpiProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="activity"
            element={
              <ProtectedRoute
                element={<ActivityPage />}
                routeName="activity"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getEpiAdminRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<EpiAdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<EpiAdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<UserEditPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<EpiAdminReportPage />}
                routeName="reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<EpiProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="activity"
            element={
              <ProtectedRoute
                element={<ActivityPage />}
                routeName="activity"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getEpiUserRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<EpiUserVaccineCertificatePage />}
                routeName="vaccine_certificate"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="vaccine_certificate"
            element={
              <ProtectedRoute
                element={<EpiUserVaccineCertificatePage />}
                routeName="vaccine_certificate"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<EpiProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getFinanceSuperRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<FinanceSuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<FinanceSuperDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<UserEditPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<FinanceSuperReportPage />}
                routeName="reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<FinanceProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="activity"
            element={
              <ProtectedRoute
                element={<ActivityPage />}
                routeName="activity"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export const getFinanceAdminRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<FinanceAdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<FinanceAdminDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<UserEditPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                element={<FinanceAdminReportPage />}
                routeName="reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<FinanceProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="activity"
            element={
              <ProtectedRoute
                element={<ActivityPage />}
                routeName="activity"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getFinanceUserRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<FinanceCertificatePaymentUserPage />}
                routeName="certificate_payment"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="certificate_payment"
            element={
              <ProtectedRoute
                element={<FinanceCertificatePaymentUserPage />}
                routeName="certificate_payment"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<FinanceProfilePage />} />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getDebuggerRouter = (
  user: User | Epi | Finance,
  authenticated: boolean
) => {
  const permissions: Map<string, UserPermission> = user.permissions;
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<DebuggerDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<DebuggerDashboardPage />}
                routeName="dashboard"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<DebuggerLogsPage />}
                routeName="logs"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                routeName="settings"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<DebuggerAuditPage />}
                routeName="audit"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
        </Route>

        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getGuestRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <GuestLayout />
            </I18nextProvider>
          }
        >
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/user/login" element={<UserLoginPage />} />
          <Route path="/auth/epi/login" element={<EpiLoginPage />} />
          <Route path="/auth/finance/login" element={<FinanceLoginPage />} />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
