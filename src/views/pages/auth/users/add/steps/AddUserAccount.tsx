import { Eye, EyeOff, RotateCcwSquare } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import { useTranslation } from "react-i18next";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import PasswordInput from "@/components/custom-ui/input/PasswordInput";
import { generatePassword } from "@/validation/utils";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { ChecklistEnum, TaskTypeEnum } from "@/lib/constants";
import { getConfiguration, validateFile } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { FileType } from "@/lib/types";

export default function AddUserAccount() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { user } = useGeneralAuthState();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const checklist = useMemo(() => {
    const isFinance = user.role.name.startsWith("finance");

    return {
      checklist_id: isFinance
        ? ChecklistEnum.finance_user_letter_of_introduction
        : ChecklistEnum.epi_user_letter_of_introduction,
      task_type: isFinance ? TaskTypeEnum.finance : TaskTypeEnum.epi,
    };
  }, [user.role.name]);
  return (
    <div className="flex flex-col mt-10 gap-y-3 w-full lg:w-[60%] 2xl:w-1/3">
      <PasswordInput
        size_="sm"
        name="password"
        lable={t("password")}
        required={true}
        requiredHint={`* ${t("required")}`}
        defaultValue={userData["password"] ? userData["password"] : ""}
        onChange={handleChange}
        placeholder={t("enter_password")}
        errorMessage={error.get("password")}
        startContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <Eye className="size-[20px] text-primary-icon pointer-events-none" />
            ) : (
              <EyeOff className="size-[20px] pointer-events-none" />
            )}
          </button>
        }
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => {
              const generatedPassword = generatePassword();
              setUserData({ ...userData, password: generatedPassword });
            }}
          >
            <RotateCcwSquare className="size-[20px] pointer-events-none" />
          </button>
        }
        type={isVisible ? "text" : "password"}
      />

      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        onSelect={(selection: any) =>
          setUserData({
            ...userData,
            ["role"]: selection,
            permissions: undefined,
          })
        }
        required={true}
        lable={t("role")}
        requiredHint={`* ${t("required")}`}
        selectedItem={userData["role"]?.name}
        placeHolder={t("select_a_role")}
        errorMessage={error.get("role")}
        apiUrl={"roles"}
        translate={true}
        cacheData={false}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["zone"]: selection })
        }
        lable={t("zone")}
        selectedItem={userData["zone"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("zone")}
        apiUrl={"zones"}
        cacheData={false}
        mode="single"
      />

      <CustomCheckbox
        checked={userData["status"] || true}
        onCheckedChange={(value: boolean) =>
          setUserData({ ...userData, status: value })
        }
        parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
        text={t("status")}
        description={t("set_acco_act_or_dec")}
        required={true}
        requiredHint={`* ${t("required")}`}
        errorMessage={error.get("status")}
      />
      <div className="my-8">
        <CheckListChooser
          number={undefined}
          hasEdit={true}
          url={`${
            import.meta.env.VITE_API_BASE_URL
          }/api/v1/epi/no/identifier/file/upload`}
          headers={{
            Authorization: "Bearer " + getConfiguration()?.token,
          }}
          name={t("user_letter_of_introduction")}
          defaultFile={userData.user_letter_of_introduction as FileType}
          uploadParam={{
            checklist_id: checklist.checklist_id,
            task_type: checklist.task_type,
          }}
          accept={"application/pdf,image/jpeg,image/png,image/jpg"}
          onComplete={async (record: any) => {
            for (const element of record) {
              const checklist = element[element.length - 1];
              setUserData({
                ...userData,
                user_letter_of_introduction: checklist,
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
                  user_letter_of_introduction: undefined,
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
        {error.get("user_letter_of_introduction") && (
          <h1 className="rtl:text-md-rtl ltr:text-sm-ltr px-2 capitalize text-start text-red-400">
            {error.get("user_letter_of_introduction")}
          </h1>
        )}
      </div>
    </div>
  );
}
