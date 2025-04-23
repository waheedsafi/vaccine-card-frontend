import { useTranslation } from "react-i18next";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EditProfilePassword } from "../general/edit-profile-password";
import UserProfileHeader from "../general/user-profile-header";
import GeneralEditProfileInformation from "./general-edit-profile-information";
import { useMemo } from "react";

export default function FinaceEpiProfilePage() {
  const { user } = useGeneralAuthState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/", { replace: true });

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;
  const authDat = useMemo(() => {
    const isFinance = user.role.name.startsWith("finance");

    return {
      profile_upload_url: isFinance
        ? "finance/profile/picture-update"
        : "epi/profile/picture-update",
      profile_delete_url: "delete/profile-picture",
    };
  }, [user.role.name]);
  return (
    <div className="flex flex-col gap-y-3 px-3 pb-12 mt-2">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("profile")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{user?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="Account"
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <UserProfileHeader
            profile_upload_url={authDat.profile_upload_url}
            profile_delete_url={authDat.profile_delete_url}
          />
          <TabsTrigger
            className={`mt-6 rtl:text-2xl-rtl ltr:text-2xl-ltr  ${selectedTabStyle}`}
            value="Account"
          >
            <Database className="size-[18px]" />
            {t("account_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr ${selectedTabStyle}`}
            value="password"
          >
            <KeyRound className="size-[18px]" />
            {t("update_account_password")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex-1 m-0" value="Account">
          <GeneralEditProfileInformation />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="password">
          <EditProfilePassword url="profile/change-password" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
