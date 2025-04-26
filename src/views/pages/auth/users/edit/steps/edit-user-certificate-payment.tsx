import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserPermission } from "@/database/tables";
export interface EditUserCirtificatePaymentProps {
  refreshPage: () => Promise<void>;
  failed: boolean;
  permissions: UserPermission;
}

export function EditUserCirtificatePayment(
  _props: EditUserCirtificatePaymentProps
) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_pass_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
