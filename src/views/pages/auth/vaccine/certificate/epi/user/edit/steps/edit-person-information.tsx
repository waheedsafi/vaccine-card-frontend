import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { BookDashed, Phone, RefreshCcw, UserRound } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { Person, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { isString } from "@/lib/utils";
export interface EditPersonInformationProps {
  id: string | undefined;
  failed: boolean;
  userData: Person | undefined;
  setUserData: Dispatch<SetStateAction<Person | undefined>>;
  refreshPage: () => Promise<void>;
  permissions: UserPermission;
}
export default function EditPersonInformation(
  props: EditPersonInformationProps
) {
  const { id, failed, userData, setUserData, refreshPage, permissions } = props;
  const [tempUserData, setTempUserData] = useState<Person | undefined>(
    userData
  );
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  useScrollToElement(error);

  useEffect(() => {
    setTempUserData(userData);
  }, [userData]);
  const handleChange = (e: any) => {
    if (tempUserData) {
      const { name, value } = e.target;
      setTempUserData({ ...tempUserData, [name]: value });
    }
  };
  const saveData = async () => {
    if (loading || tempUserData === undefined || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "full_name",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "father_name",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "date_of_birth",
          rules: ["required"],
        },
        {
          name: "passport_number",
          rules: ["required"],
        },
        {
          name: "gender",
          rules: ["required"],
        },
        {
          name: "province",
          rules: ["required"],
        },
        {
          name: "district",
          rules: ["required"],
        },
        {
          name: "nationality",
          rules: ["required"],
        },
      ],
      tempUserData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    const formData = new FormData();
    formData.append("id", id);
    formData.append("full_name", tempUserData.full_name);
    formData.append("father_name", tempUserData.father_name);
    formData.append(
      "date_of_birth",
      !isString(tempUserData.date_of_birth)
        ? tempUserData.date_of_birth?.toDate()?.toISOString()
        : tempUserData.date_of_birth
    );
    formData.append("contact", tempUserData.contact);
    formData.append("passport_number", tempUserData.passport_number);
    formData.append("gender_id", tempUserData.gender.id);
    formData.append("province_id", tempUserData.province.id);
    formData.append("district_id", tempUserData.district.id);
    formData.append("nationality_id", tempUserData.nationality.id);

    try {
      const response = await axiosClient.post(
        "epi/person/update/information",
        formData
      );
      if (response.status == 200) {
        // Update user state
        setUserData(tempUserData);
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

  const hasEdit = permissions.sub.get(
    PermissionEnum.vaccine_certificate.sub.vaccine_certificate_person_info
  )?.edit;
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-x-4 gap-y-6 w-full lg:w-[70%] 2xl:w-1/2">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : tempUserData === undefined ? (
          <NastranSpinner />
        ) : (
          <>
            <CustomInput
              required={true}
              lable={t("full_name")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="full_name"
              defaultValue={tempUserData["full_name"]}
              placeholder={t("enter_your_name")}
              type="text"
              errorMessage={error.get("full_name")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              required={true}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              lable={t("father_name")}
              name="father_name"
              defaultValue={tempUserData["father_name"]}
              placeholder={t("enter_name")}
              type="text"
              errorMessage={error.get("father_name")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("date_of_birth")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={tempUserData.date_of_birth}
              dateOnComplete={(date: DateObject) => {
                setTempUserData({ ...tempUserData, date_of_birth: date });
              }}
              className="py-3 w-full"
              errorMessage={error.get("date_of_birth")}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              className="rtl:text-end"
              lable={t("contact")}
              placeholder={t("enter_ur_pho_num")}
              defaultValue={tempUserData["contact"]}
              type="text"
              name="contact"
              errorMessage={error.get("contact")}
              onChange={handleChange}
              startContent={
                <Phone className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              className="rtl:text-end"
              lable={t("passport_number")}
              placeholder={t("enter")}
              defaultValue={tempUserData["passport_number"]}
              type="text"
              name="passport_number"
              errorMessage={error.get("passport_number")}
              onChange={handleChange}
              startContent={
                <BookDashed className="text-tertiary size-[18px] pointer-events-none" />
              }
              readOnly={true}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["gender"]: selection })
              }
              lable={t("gender")}
              selectedItem={tempUserData["gender"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("gender")}
              apiUrl={"genders"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["province"]: selection })
              }
              lable={t("province")}
              selectedItem={tempUserData["province"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("province")}
              apiUrl={"provinces/" + 1}
              mode="single"
            />
            {tempUserData.province && (
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setUserData({ ...tempUserData, ["district"]: selection })
                }
                lable={t("district")}
                required={true}
                selectedItem={tempUserData["district"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("district")}
                apiUrl={"districts/" + userData?.province?.id}
                mode="single"
                key={userData?.province?.id}
              />
            )}

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["nationality"]: selection })
              }
              lable={t("nationality")}
              selectedItem={tempUserData["nationality"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("nationality")}
              apiUrl={"nationalities"}
              mode="single"
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await refreshPage()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          tempUserData &&
          hasEdit && (
            <PrimaryButton
              disabled={loading}
              onClick={saveData}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
