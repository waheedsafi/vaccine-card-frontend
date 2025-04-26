import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
interface PaymentDetailProps {
  amount: number;
  currency: string;
  passport_number: string;
}
export default function PaymentDetail(props: PaymentDetailProps) {
  const { amount, passport_number, currency } = props;
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 w-fit place-items-start gap-x-4 gap-y-2 border-dashed border-[2px] p-4 rounded-lg mb-12">
        <h1 className=" font-bold">{t("amount_to_pay")}:</h1>
        <h1 className=" text-primary/90">{amount}</h1>
        <h1 className=" font-bold">{t("currency")}:</h1>
        <h1 className=" text-primary/90">{currency}</h1>
        <h1 className=" font-bold">{t("passport_number")}:</h1>
        <h1 className=" text-primary/90">{passport_number}</h1>
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
