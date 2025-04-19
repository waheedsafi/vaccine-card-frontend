import {
  getDebuggerRouter,
  getEpiAdminRouter,
  getEpiSuperRouter,
  getEpiUserRouter,
  getFinanceAdminRouter,
  getFinanceSuperRouter,
  getFinanceUserRouter,
  getGuestRouter,
} from "./routes/routes";
import { useGeneralAuthState } from "./context/AuthContextProvider";
import { RoleEnum } from "./lib/constants";

export default function App() {
  const { user, loading, authenticated } = useGeneralAuthState();
  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      user.role.role == RoleEnum.epi_super
        ? getEpiSuperRouter(user, authenticated)
        : user.role.role == RoleEnum.epi_admin
        ? getEpiAdminRouter(user, authenticated)
        : user.role.role == RoleEnum.epi_user
        ? getEpiUserRouter(user, authenticated)
        : user.role.role == RoleEnum.finance_super
        ? getFinanceSuperRouter(user, authenticated)
        : user.role.role == RoleEnum.finance_admin
        ? getFinanceAdminRouter(user, authenticated)
        : user.role.role == RoleEnum.finance_user
        ? getFinanceUserRouter(user, authenticated)
        : user.role.role == RoleEnum.debugger
        ? getDebuggerRouter(user, authenticated)
        : getGuestRouter();
  }
  return routes;
}
