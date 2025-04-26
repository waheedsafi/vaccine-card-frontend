import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toLocaleDate } from "@/lib/utils";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useGlobalState } from "@/context/GlobalStateContext";

export function CertificatePaymentEditPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  let { id } = useParams();
  const [state] = useGlobalState();

  const loadInformation = async () => {
    try {
      const response = await axiosClient.get("finance/payment/info/" + id);
      if (response.status == 200) {
        const payment_list = response.data.data;
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
    setLoading(false);
  };
  useEffect(() => {
    loadInformation();
  }, []);
  const skeleton = (
    <TableRow>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="m-4">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("update_account_password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_pass_descrip")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="bg-card rounded-md my-[2px] py-8">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start px-1">{t("#")}</TableHead>
              <TableHead className="text-start">
                {t("passport_number")}
              </TableHead>
              <TableHead className="text-start">{t("full_name")}</TableHead>
              <TableHead className="text-start">{t("father_name")}</TableHead>
              <TableHead className="text-start">{t("contact")}</TableHead>
              <TableHead className="text-start">{t("payment")}</TableHead>
              <TableHead className="text-start">
                {t("last_visit_date")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
            {loading ? (
              <>{skeleton}</>
            ) : (
              payments.map((item: any) => (
                <TableRowIcon
                  read={false}
                  remove={false}
                  edit={false}
                  onEdit={async () => {}}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                  item={undefined}
                >
                  <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                    {item.id}
                  </TableCell>
                  <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                    {item.passport_number}
                  </TableCell>

                  <TableCell
                    dir="ltr"
                    className="truncate rtl:text-sm-rtl rtl:text-end"
                  >
                    {item.full_name}
                  </TableCell>
                  <TableCell
                    dir="ltr"
                    className="truncate rtl:text-sm-rtl rtl:text-end"
                  >
                    {item.father_name}
                  </TableCell>
                  <TableCell
                    dir="ltr"
                    className="rtl:text-end rtl:text-sm-rtl truncate"
                  >
                    {item?.contact}
                  </TableCell>
                  <TableCell dir="ltr" className="truncate">
                    {item.payment_status_id == item.paid
                      ? t("paid")
                      : t("unpaid")}
                  </TableCell>
                  <TableCell className="truncate">
                    {toLocaleDate(new Date(item.last_visit_date), state)}
                  </TableCell>
                </TableRowIcon>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
