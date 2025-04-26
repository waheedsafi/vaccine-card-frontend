import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";

export function CertificatePaymentEditPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<{}>();
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get("finance/payment/info");
      if (response.status == 200) {
        const payment_list = response.data.payment_list;
        setPayments(payment_list);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

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
        {loading ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2"></div>
        )}
      </CardContent>
    </Card>
  );
}
