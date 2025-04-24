import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound, ShieldBan } from "lucide-react";
import { Person, UserPermission } from "@/database/tables";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { PermissionEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import PersonEditHeader from "./person-edit-header";
import EditPersonInformation from "./steps/edit-person-information";
import PersonVaccinesInformation from "./steps/person-vaccines-information";

export default function VaccineCertificateEditPage() {
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<Person>();
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`epi/person/information/${id}`);
      if (response.status == 200) {
        const user = response.data.data as Person;
        setUserData(user);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.vaccine_certificate.name
  ) as UserPermission;

  const tableList = Array.from(per.sub).map(
    ([key, _subPermission], index: number) => {
      return key ==
        PermissionEnum.vaccine_certificate.sub
          .vaccine_certificate_person_info ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <Database className="size-[18px]" />
          {t("person_info")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.vaccine_certificate.sub
          .vaccine_certificate_vaccination_info ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <KeyRound className="size-[18px]" />
          {t("vaccination_info")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.vaccine_certificate.sub
          .vaccine_certificate_card_issuing ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <ShieldBan className="size-[18px]" />
          {t("card_issuing")}
        </TabsTrigger>
      ) : undefined;
    }
  );
  return (
    <div className="flex flex-col gap-y-3 px-3 pt-2 overflow-x-auto pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("users")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {userData?.full_name}
        </BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.vaccine_certificate.sub.vaccine_certificate_person_info.toString()}
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <PersonEditHeader userData={userData} />
          {tableList}
        </TabsList>

        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.vaccine_certificate.sub.vaccine_certificate_person_info.toString()}
        >
          <EditPersonInformation
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
            refreshPage={loadInformation}
            permissions={per}
          />
        </TabsContent>

        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.vaccine_certificate.sub.vaccine_certificate_vaccination_info.toString()}
        >
          <PersonVaccinesInformation id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
