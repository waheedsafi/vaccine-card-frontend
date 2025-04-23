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
    _userData: any,
    _currentStep: number,
    _setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
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
              // { name: "full_name", rules: ["required", "max:45", "min:3"] },
              // { name: "father_name", rules: ["required", "max:45", "min:3"] },
              // { name: "gender", rules: ["required"] },
              // { name: "province", rules: ["required"] },
              // { name: "district", rules: ["required"] },
              // { name: "date_of_birth", rules: ["required"] },
              // { name: "passport_number", rules: ["required"] },
              // { name: "nationality", rules: ["required"] },
              // { name: "travel_type", rules: ["required"] },
              // { name: "destina_country", rules: ["required"] },
            ],
          },
          {
            component: <AddVaccineDetail />,
            validationRules: [
              { name: "vaccine_type", rules: ["required"] },
              { name: "registration_date", rules: ["required"] },
              { name: "registration_number", rules: ["required"] },
              { name: "volume", rules: ["required"] },
              { name: "page", rules: ["required"] },
              { name: "vaccine_center", rules: ["required"] },
              { name: "batch_number", rules: ["required"] },
              { name: "vaccine_date", rules: ["required"] },
              { name: "vaccine_date", rules: ["required"] },
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
