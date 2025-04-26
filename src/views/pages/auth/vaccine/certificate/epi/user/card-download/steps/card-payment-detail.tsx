import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import { ChecklistEnum, TaskTypeEnum } from "@/lib/constants";
import { FileType } from "@/lib/types";
import { getConfiguration, validateFile } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
interface PaymentDetailProps {
  passport_number: string;
}
export default function CardPaymentDetail(props: PaymentDetailProps) {
  const { passport_number } = props;
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col">
      <CustomInput
        parentClassName="mx-auto min-w-[380px]"
        required={true}
        lable={t("payment_number")}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        name="payment_number"
        defaultValue={userData["payment_number"]}
        placeholder={t("enter")}
        type="text"
        errorMessage={error.get("payment_number")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <div className="my-8">
        <CheckListChooser
          number={undefined}
          hasEdit={true}
          url={`${import.meta.env.VITE_API_BASE_URL}/api/v1/file/upload`}
          headers={{
            Authorization: "Bearer " + getConfiguration()?.token,
          }}
          name={t("receipt")}
          defaultFile={userData.receipt as FileType}
          uploadParam={{
            checklist_id: ChecklistEnum.reciept,
            task_type: TaskTypeEnum.finance,
            unique_identifier: passport_number,
          }}
          accept={"application/pdf,image/jpeg,image/png,image/jpg"}
          onComplete={async (record: any) => {
            for (const element of record) {
              const checklist = element[element.length - 1];
              setUserData({
                ...userData,
                receipt: checklist,
              });
            }
          }}
          onFailed={async (failed: boolean, response: any) => {
            if (failed) {
              if (response) {
                toast({
                  toastType: "ERROR",
                  description: response.data.message,
                });
                setUserData({
                  ...userData,
                  receipt: undefined,
                });
              }
            }
          }}
          onStart={async (_file: File) => {}}
          validateBeforeUpload={function (file: File): boolean {
            const maxFileSize = 3 * 1024 * 1024; // 3MB
            const resultFile = validateFile(
              file,
              Math.round(maxFileSize),
              ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
              t
            );
            return resultFile ? true : false;
          }}
        />
        {error.get("receipt") && (
          <h1 className="rtl:text-md-rtl ltr:text-sm-ltr px-2 capitalize text-start text-red-400">
            {error.get("receipt")}
          </h1>
        )}
      </div>
    </div>
  );
}
