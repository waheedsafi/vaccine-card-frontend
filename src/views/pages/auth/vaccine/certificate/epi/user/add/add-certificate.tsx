import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import { Check, Database, User as UserIcon } from "lucide-react";
import { checkStrength, passwordStrengthScore } from "@/validation/utils";
import AddPersonalDetail from "./steps/add-personal-detail";
import AddVaccineDetail from "./steps/add-vaccine-detail";
import { PersonCertificate } from "@/database/tables";

export interface AddCertificateProps {
  onComplete: (personCertificate: PersonCertificate) => void;
}
export default function AddCertificate(props: AddCertificateProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const beforeStepSuccess = async (
    userData: any,
    currentStep: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    if (currentStep == 1) {
      try {
        let formData = new FormData();
        formData.append("email", userData?.email);
        formData.append("contact", userData?.contact);
        const response = await axiosClient.post(
          "user/validate/email/contact",
          formData
        );
        if (response.status == 200) {
          const emailExist = response.data.email_found === true;
          const contactExist = response.data.contact_found === true;
          if (emailExist || contactExist) {
            const errMap = new Map<string, string>();
            if (emailExist) {
              errMap.set("email", `${t("email")} ${t("is_registered_before")}`);
            }
            if (contactExist) {
              errMap.set(
                "contact",
                `${t("contact")} ${t("is_registered_before")}`
              );
            }
            setError(errMap);
            return false;
          }
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
        return false;
      }
    }
    return true;
  };
  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    try {
      const response = await axiosClient.post("epi/user/store", {
        permissions: userData?.permissions,
        status: userData.status == true,
        role_id: userData?.role?.id,
        zone_id: userData?.zone?.id,
        job_id: userData.job.id,
        destination_id: userData.destination.id,
        contact: userData.contact,
        password: userData.password,
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        gender_id: userData.gender.id,
        province_id: userData.province.id,
      });
      if (response.status == 200) {
        onComplete(response.data.user);
        toast({
          toastType: "SUCCESS",
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
      return false;
    }
    return true;
  };
  const closeModel = () => {
    modelOnRequestHide();
  };

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={closeModel} />
      </div>
      {/* Body */}
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="bg-transparent dark:!bg-transparent"
        progressText={{
          complete: t("complete"),
          inProgress: t("in_progress"),
          pending: t("pending"),
          step: t("step"),
        }}
        loadingText={t("store_infor")}
        backText={t("back")}
        nextText={t("next")}
        confirmText={t("confirm")}
        steps={[
          {
            description: t("personal_details"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("vaccine_detail"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <AddPersonalDetail />,
            validationRules: [
              { name: "full_name", rules: ["required", "max:45", "min:3"] },
              { name: "father_name", rules: ["required", "max:45", "min:3"] },
              { name: "gender", rules: ["required"] },
              { name: "province", rules: ["required"] },
              { name: "district", rules: ["required"] },
              { name: "date_of_birth", rules: ["required"] },
              { name: "passport_no", rules: ["required"] },
              { name: "nationality", rules: ["required"] },
              { name: "travel_type", rules: ["required"] },
              { name: "destina_country", rules: ["required"] },
            ],
          },
          {
            component: <AddVaccineDetail />,
            validationRules: [
              {
                name: "password",
                rules: [
                  (value: any) => {
                    const strength = checkStrength(value, t);
                    const score = passwordStrengthScore(strength);
                    if (score === 4) return true;
                    return false;
                  },
                ],
              },
              { name: "user_letter_of_introduction", rules: ["required"] },
              { name: "role", rules: ["required"] },
              { name: "zone", rules: ["required"] },
              // {
              //   name: "role",
              //   rules: [
              //     (value: any) => {
              //       if (
              //         user.role.role == RoleEnum.epi_super ||
              //         user.role.role == RoleEnum.finance_super
              //       ) {
              //         return false;
              //       } else {
              //         if (value) return false;
              //         else return true;
              //       }
              //     },
              //   ],
              // },
              // {
              //   name: "zone",
              //   rules: [
              //     (value: any) => {
              //       if (
              //         user.role.role == RoleEnum.epi_super ||
              //         user.role.role == RoleEnum.finance_super
              //       ) {
              //         return false;
              //       } else {
              //         if (value) return false;
              //         else return true;
              //       }
              //     },
              //   ],
              // },
            ],
          },
          {
            component: (
              <CompleteStep
                successText={t("congratulation")}
                closeText={t("close")}
                againText={t("again")}
                closeModel={closeModel}
                description={t("user_acc_crea")}
              />
            ),
            validationRules: [],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </div>
  );
}
