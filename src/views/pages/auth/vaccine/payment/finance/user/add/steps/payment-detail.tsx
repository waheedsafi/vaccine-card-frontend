import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import { UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
interface PaymentDetailProps {
  amount: number;
  passport_number: string;
}
export default function PaymentDetail(props: PaymentDetailProps) {
  const { amount, passport_number } = props;
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  useScrollToElement(error);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col">
      <div className="flex gap-x-4 items-start gap-y-2 bg-green-400/50 mx-auto p-4 rounded-lg mb-12">
        <div className="flex gap-x-4 items-center font-bold ltr:text-[18px]">
          <h1>{t("amount_to_pay")}:</h1>
          <h1 className=" text-primary/90 font-bold">{amount}</h1>
        </div>
        <div className="flex gap-x-4 items-center font-bold ltr:text-[18px]">
          <h1>{t("passport_number")}:</h1>
          <h1 className=" text-primary/90 font-bold">{passport_number}</h1>
        </div>
      </div>
      <CustomInput
        parentClassName="mx-auto min-w-[380px]"
        required={true}
        lable={t("amount")}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        name="amount"
        defaultValue={userData["amount"]}
        placeholder={t("enter")}
        type="number"
        errorMessage={error.get("amount")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
    </div>
  );
}
