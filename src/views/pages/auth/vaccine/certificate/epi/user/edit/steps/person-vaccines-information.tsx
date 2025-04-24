import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "@/context/GlobalStateContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PersonVisit } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
export interface PersonVaccinesInformationProps {
  id: string | undefined;
}
export default function PersonVaccinesInformation(
  props: PersonVaccinesInformationProps
) {
  const { id } = props;
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [vaccinations, setVaccinations] = useState([]);
  const initialize = async () => {
    try {
      // 2. Send data
      const response = await axiosClient.get("epi/person/vaccines/" + id);
      if (response.status == 200) {
        setVaccinations(response.data.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <NastranSpinner />
        ) : (
          <Table className="bg-card rounded-md">
            <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-start">
                  {t("vaccine_type")}
                </TableHead>
                <TableHead className="text-start">{t("travel_type")}</TableHead>
                <TableHead className="text-start">
                  {t("visited_date")}
                </TableHead>
                <TableHead className="text-start">
                  {t("destination_country")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
              {vaccinations.map((item: PersonVisit, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-start truncate">
                    {item.vaccine_type}
                  </TableCell>
                  <TableCell className="text-start truncate">
                    {item.travel_type}
                  </TableCell>
                  <TableCell className="text-start truncate">
                    {toLocaleDate(new Date(item.visited_date), state)}
                  </TableCell>
                  <TableCell className=" text-center truncate">
                    {item.destination_country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
