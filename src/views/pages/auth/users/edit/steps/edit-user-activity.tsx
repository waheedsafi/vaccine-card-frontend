import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { UserPermission } from "@/database/tables";
export interface EditUserActivityProps {
  refreshPage: () => Promise<void>;
  failed: boolean;
  permissions: UserPermission;
}

export function EditUserActivity(props: EditUserActivityProps) {
  const { failed } = props;
  const { t } = useTranslation();
  const [loading] = useState(false);

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
      <CardContent>
        {failed ? (
          <h1>{t("u_are_not_authzed!")}</h1>
        ) : loading ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2"></div>
        )}
      </CardContent>
    </Card>
  );
}
