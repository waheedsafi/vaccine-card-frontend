import CustomInput from "@/components/custom-ui/input/CustomInput";
import {
  CalendarDays,
  ChevronsUpDown,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { Role } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import FakeCombobox from "@/components/custom-ui/combobox/FakeCombobox";
import { useEpiAuthState } from "@/context/AuthContextProvider";
import { useScrollToElement } from "@/hook/use-scroll-to-element";

interface ProfileInformation {
  id: string;
  registeration_number: string;
  gender: string;
  province: string;
  zone: string;
  full_name: string;
  username: string;
  email: string;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  created_at: string;
  imagePreviewUrl: any;
}
export default function GeneralEditProfileInformation() {
  const { user, setEpi } = useEpiAuthState();
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  useScrollToElement(error);
  const [userData, setUserData] = useState<ProfileInformation>({
    id: user.id,
    registeration_number: user.registeration_number,
    gender: user.gender,
    province: user.province,
    zone: user.zone,
    imagePreviewUrl: undefined,
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    contact: user.contact,
    destination: user.destination,
    job: user.job,
    role: user.role,
    created_at: user.created_at,
  });
  const handleChange = (e: any) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    }
  };
  const saveData = async () => {
    if (loading) return;
    setLoading(true);
    // 1. Validation
    if (
      !(await validate(
        [
          { name: "username", rules: ["required", "max:45", "min:3"] },
          { name: "full_name", rules: ["required", "max:45", "min:3"] },
        ],
        userData,
        setError
      ))
    ) {
      setLoading(false);
      return;
    }
    // 2. Send data
    const formData = new FormData();
    formData.append("id", userData.id);
    formData.append("username", userData.username);
    formData.append("full_name", userData.full_name);
    formData.append("contact", userData.contact ? userData.contact : "");
    try {
      const response = await axiosClient.post(
        "general/profile/info/update",
        formData
      );
      if (response.status == 200) {
        // Change logged in user data

        await setEpi({
          ...user,
          username: userData.username,
          full_name: userData.full_name,
          contact: userData.contact,
        });

        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-x-4 gap-y-6 w-full lg:w-1/2 2xl:h-1/3">
        <FakeCombobox
          title={t("registration_number")}
          selected={user.registeration_number}
        />
        <CustomInput
          size_="md"
          lable={t("full_name")}
          name="full_name"
          defaultValue={userData.full_name}
          placeholder={t("enter_your_name")}
          type="text"
          errorMessage={error.get("full_name")}
          onBlur={handleChange}
          startContent={
            <UserRound className="text-secondary-foreground size-[18px] pointer-events-none" />
          }
        />
        <CustomInput
          size_="md"
          name="username"
          lable={t("username")}
          defaultValue={userData.username}
          placeholder={t("enter_user_name")}
          type="text"
          errorMessage={error.get("username")}
          onBlur={handleChange}
          startContent={
            <UserRound className="text-secondary-foreground size-[18px] pointer-events-none" />
          }
        />
        <CustomInput
          size_="sm"
          className={`rtl:text-right`}
          placeholder={t("enter_ur_pho_num")}
          defaultValue={userData.contact ? userData.contact : ""}
          lable={t("contact")}
          type="text"
          name="contact"
          dir="ltr"
          errorMessage={error.get("contact")}
          onChange={handleChange}
          startContent={
            <Phone className="text-primary-icon size-[18px] pointer-events-none" />
          }
        />
        <FakeCombobox
          icon={
            <Mail className="text-secondary-foreground size-[18px] pointer-events-none absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("email")}
          selected={user.email}
        />
        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("gender")}
          selected={user.gender}
        />
        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("department")}
          selected={user.destination}
        />
        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("job")}
          selected={user.job}
        />
        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("role")}
          selected={user.role.name}
        />

        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("province")}
          selected={user.province}
        />
        <FakeCombobox
          icon={
            <ChevronsUpDown className="size-[16px] absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("zone")}
          selected={user.zone}
        />
        <FakeCombobox
          icon={
            <CalendarDays className="size-[16px] text-tertiary absolute top-1/2 transform -translate-y-1/2 ltr:right-4 rtl:left-4" />
          }
          title={t("join_date")}
          selected={toLocaleDate(new Date(user.created_at), state)}
        />
      </CardContent>
      <CardFooter>
        <PrimaryButton
          disabled={loading}
          onClick={saveData}
          className={`shadow-lg`}
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
