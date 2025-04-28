import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { UserPermission, VaccineType } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import VaccineTypeDialog from "./vaccine-type-dialog";
interface VaccineTypeTabTabProps {
  permissions: UserPermission;
}
export default function VaccineTypeTab(props: VaccineTypeTabTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    vaccineType: any;
  }>({
    visible: false,
    vaccineType: undefined,
  });
  const [vaccineTypes, setVaccineTypes] = useState<{
    unFilterList: VaccineType[];
    filterList: VaccineType[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`full/vaccine/types`);
      const fetch = response.data as VaccineType[];
      setVaccineTypes({
        unFilterList: fetch,
        filterList: fetch,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const searchOnChange = (e: any) => {
    const { value } = e.target;
    // 1. Filter
    const filtered = vaccineTypes.unFilterList.filter((item: VaccineType) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setVaccineTypes({
      ...vaccineTypes,
      filterList: filtered,
    });
  };
  const add = (item: VaccineType) => {
    setVaccineTypes((prev) => ({
      unFilterList: [item, ...prev.unFilterList],
      filterList: [item, ...prev.filterList],
    }));
  };
  const update = (vaccineType: VaccineType) => {
    setVaccineTypes((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === vaccineType.id ? { ...item, name: vaccineType.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
  };

  const dailog = useMemo(
    () => (
      <NastranModel
        size="lg"
        visible={selected.visible}
        isDismissable={false}
        button={<button></button>}
        showDialog={async () => {
          setSelected({
            visible: false,
            vaccineType: undefined,
          });
          return true;
        }}
      >
        <VaccineTypeDialog
          vaccineType={selected.vaccineType}
          onComplete={update}
        />
      </NastranModel>
    ),
    [selected.visible]
  );
  const vaccineType = permissions.sub.get(
    PermissionEnum.configurations.sub.configuration_vaccine_type
  );
  const hasEdit = vaccineType?.edit;
  const hasAdd = vaccineType?.add;
  const hasView = vaccineType?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <VaccineTypeDialog onComplete={add} />
          </NastranModel>
        )}

        <CustomInput
          size_="lg"
          placeholder={`${t("search")}...`}
          parentClassName="flex-1"
          type="text"
          onChange={searchOnChange}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
        />
      </div>
      <Table className="bg-card rounded-md mt-1 py-8 w-full">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("name")}</TableHead>
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
            <TableRow>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            vaccineTypes.filterList.map(
              (vaccineType: VaccineType, index: number) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={hasEdit}
                  onEdit={async (item: VaccineType) => {
                    setSelected({
                      visible: true,
                      vaccineType: item,
                    });
                  }}
                  key={index}
                  item={vaccineType}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">
                    {vaccineType.id}
                  </TableCell>
                  <TableCell>{vaccineType.name}</TableCell>
                  <TableCell>
                    {toLocaleDate(
                      new Date(
                        vaccineType?.created_at ? vaccineType?.created_at : ""
                      ),
                      state
                    )}
                  </TableCell>
                </TableRowIcon>
              )
            )
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
