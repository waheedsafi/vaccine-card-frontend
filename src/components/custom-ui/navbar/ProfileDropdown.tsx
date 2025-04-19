import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { useTranslation } from "react-i18next";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { RoleEnum } from "@/lib/constants";

function ProfileDropdown() {
  const { user, logoutFinance, logoutUser, logoutEpi } = useGeneralAuthState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-10 cursor-pointer ">
        <div>
          <CachedImage
            src={user?.profile}
            alt="Avatar"
            ShimmerIconClassName="size-[18px]"
            shimmerClassName="size-[36px] ltr:mr-8 rtl:ml-8 shadow-lg border border-tertiary rounded-full size-[36px] select-none"
            className="size-[36px] ltr:mr-8 rtl:ml-8 object-center object-cover shadow-lg border border-tertiary  rounded-full"
            routeIdentifier={"profile"}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 rtl:text-end rtl:[&>*]:text-md-rtl ltr:[&>*]:text-lg-ltr">
        <DropdownMenuLabel>
          <h1>{t("signed_in_as")}</h1>
          <h1 className="text-[14px] ">{user?.username}</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => navigate("/profile")}
        >
          {t("profile")}
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            if (
              user.role.role == RoleEnum.epi_super ||
              user.role.role == RoleEnum.epi_admin ||
              user.role.role == RoleEnum.epi_user
            ) {
              await logoutEpi();
              navigate("/auth/epi/login", { replace: true });
            } else if (
              user.role.role === RoleEnum.finance_super ||
              user.role.role === RoleEnum.finance_admin ||
              user.role.role === RoleEnum.finance_user
            ) {
              await logoutFinance();
              navigate("/auth/finance/login", { replace: true });
            } else {
              await logoutUser();
              navigate("/auth/user/login", { replace: true });
            }
          }}
        >
          {t("log_out")}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default memo(ProfileDropdown);
