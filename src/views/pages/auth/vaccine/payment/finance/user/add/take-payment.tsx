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
import { Vaccine } from "@/database/tables";
import { isString } from "@/lib/utils";
import PaymentDetail from "./steps/payment-detail";

export default function TakePayment() {
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
      const formatedVaccines: any[] = [];
      userData?.vaccines_list?.forEach((vaccine: Vaccine) => {
        const item: {
          id: any;
          vaccine_type_id: any;
          registration_number: any;
          volume: any;
          page: any;
          registration_date: any;
          vaccine_center_id: any;
          doses: any[];
        } = {
          id: vaccine.id,
          vaccine_type_id: vaccine.vaccine_type?.id,
          registration_number: vaccine.registration_number,
          volume: vaccine.volume,
          page: vaccine.page,
          registration_date: vaccine.registration_date?.toDate()?.toISOString(),
          vaccine_center_id: vaccine.vaccine_center?.id,
          doses: [],
        };
        const doses: any[] = [];

        vaccine.doses.forEach((dose: any) => {
          doses.push({
            id: dose.id,
            dose: dose.dose,
            batch_number: dose.batch_number,
            vaccine_date: dose.vaccine_date?.toDate()?.toISOString(),
            added_by: dose.added_by,
          });
        });
        item.doses.push(doses);
        formatedVaccines.push(item);
      });
      const response = await axiosClient.post("epi/certificate/detail/store", {
        vaccines: JSON.stringify(formatedVaccines),
        full_name: userData.full_name,
        father_name: userData.father_name,
        date_of_birth: !isString(userData.date_of_birth)
          ? userData.date_of_birth?.toDate()?.toISOString()
          : userData.date_of_birth,
        contact: userData.contact,
        passport_number: userData.passport_number,
        gender_id: userData.gender?.id,
        province_id: userData.province?.id,
        district_id: userData.district?.id,
        nationality_id: userData.nationality?.id,
        travel_type_id: userData.travel_type?.id,
        destina_country_id: userData.destina_country?.id,
      });
      if (response.status == 200) {
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
            component: <PaymentDetail />,
            validationRules: [
              { name: "full_name", rules: ["required", "max:45", "min:3"] },
              { name: "father_name", rules: ["required", "max:45", "min:3"] },
              { name: "gender", rules: ["required"] },
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
