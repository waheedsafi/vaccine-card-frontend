import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGeneralAuthState } from "@/context/AuthContextProvider";
import { CertificatePayment, UserPermission } from "@/database/tables";
import { CACHE, PaymentStatusEnum, PermissionEnum } from "@/lib/constants";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import Pagination from "@/components/custom-ui/table/Pagination";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { Coins, ListFilter, Search, TriangleAlert } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";
import { PersonCertificateSearch } from "@/lib/types";
import React from "react";
import TakePayment from "./add/take-payment";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";

export function CertificatePaymentTable() {
  const { user } = useGeneralAuthState();
  const navigate = useNavigate();
  const [error, setError] = useState<Map<string, string>>();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateComponentCache, getComponentCache } = useCacheDB();
  const [searchParams] = useSearchParams();
  // Accessing individual search filters
  const searchValue = searchParams.get("sch_val");
  const searchColumn = searchParams.get("sch_col");
  const filters = {
    search: {
      column: searchColumn == null ? "passport_number" : searchColumn,
      value: searchValue == null ? "" : searchValue,
    },
  };
  const [certificatePayment, setCertificatePayment] =
    useState<CertificatePayment>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { t } = useTranslation();
  const [state] = useGlobalState();

  const searchPerson = async (
    searchInput: string | undefined = undefined,
    count: number | undefined,
    page: number | undefined
  ) => {
    try {
      // 1. validate
      if (searchInput?.trim() == "") {
        const errMap = new Map<string, string>();
        errMap.set("search", `${t(filters.search.column)} ${t("is_required")}`);
        setError(errMap);
        return;
      } else {
        const errMap = new Map<string, string>();
        setError(errMap);
      }
      if (loading) return;
      if (notFound) {
        setNotFound(false);
      }
      setLoading(true);
      const response = await axiosClient.get("finance/certificate/search", {
        params: {
          page: page,
          per_page: count,
          filters: {
            search: {
              column: filters.search.column,
              value: searchInput,
            },
          },
        },
      });
      const certificate_payment = response.data
        .certificate_payment as CertificatePayment;

      if (certificate_payment) {
        setCertificatePayment(certificate_payment);
      } else {
        setNotFound(true);
        setCertificatePayment(undefined);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        // description: error.response.data.message,
      });
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = () => {
    setCertificatePayment((prev) => {
      if (!prev) return prev; // do nothing if prev is undefined

      return {
        ...prev,
        payment_status_id: PaymentStatusEnum.paid,
      };
    });
  };

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
      <TableCell>
        <Shimmer className="h-[24px] w-full rounded-sm" />
      </TableCell>
    </TableRow>
  );
  const per: UserPermission = user?.permissions.get(
    PermissionEnum.certificate_payment.name
  ) as UserPermission;
  const hasView = per?.view;
  const hasAdd = per?.add;

  const watchOnClick = async (personCertificate: CertificatePayment) => {
    const userId = personCertificate.id;
    navigate(`/certificate_payment/${userId}`);
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        <CustomInput
          size_="lg"
          placeholder={`${t(filters.search.column)}...`}
          parentClassName="sm:flex-1 col-span-3"
          type="text"
          name="search"
          errorMessage={error?.get("search")}
          ref={searchRef}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
          endContent={
            <SecondaryButton
              onClick={async () => {
                if (searchRef.current != undefined)
                  await searchPerson(
                    searchRef.current.value,
                    undefined,
                    undefined
                  );
              }}
              className="w-[72px] absolute rtl:left-[6px] ltr:right-[6px] -top-[7px] h-[32px] rtl:text-sm-rtl ltr:text-md-ltr hover:shadow-sm shadow-lg"
            >
              {t("search")}
            </SecondaryButton>
          }
        />
        <div className="sm:px-4 col-span-3 flex-1 self-start sm:self-baseline flex justify-end items-center">
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <SecondaryButton
                className="px-8 rtl:text-md-rtl ltr:text-md-ltr"
                type="button"
              >
                {t("filter")}
                <ListFilter className="text-secondary mx-2 size-[15px]" />
              </SecondaryButton>
            }
            showDialog={async () => true}
          >
            <FilterDialog
              filters={filters}
              sortOnComplete={async () => {}}
              searchFilterChanged={async (
                filterName: PersonCertificateSearch
              ) => {
                if (filterName != filters.search.column) {
                  const queryParams = new URLSearchParams();
                  queryParams.set("sch_col", filterName);
                  queryParams.set("sch_val", filters.search.value);
                  navigate(`/vaccine_certificate?${queryParams.toString()}`, {
                    replace: true,
                  });
                }
              }}
              orderOnComplete={async () => {}}
              dateOnComplete={(_selectedDates: DateObject[]) => {}}
              filtersShowData={{
                sort: [],
                order: [],
                search: [
                  {
                    name: "passport_number",
                    translate: t("passport_number"),
                    onClick: () => {},
                  },
                ],
              }}
              showColumns={{
                sort: false,
                order: false,
                search: true,
                date: false,
              }}
            />
          </NastranModel>
        </div>
        <CustomSelect
          paginationKey={CACHE.VACCINE_CERTIFICATE_TABLE_PAGINATION_COUNT}
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          className="w-fit sm:self-baseline"
          updateCache={updateComponentCache}
          getCache={async () =>
            await getComponentCache(
              CACHE.VACCINE_CERTIFICATE_TABLE_PAGINATION_COUNT
            )
          }
          placeholder={`${t("select")}...`}
          emptyPlaceholder={t("no_options_found")}
          rangePlaceholder={t("count")}
          onChange={async (value: string) =>
            await searchPerson(undefined, parseInt(value), undefined)
          }
        />
      </div>
      <Table className="bg-card rounded-md my-[2px] py-8">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start px-1">{t("#")}</TableHead>
            <TableHead className="text-start">{t("passport_number")}</TableHead>
            <TableHead className="text-start">{t("full_name")}</TableHead>
            <TableHead className="text-start">{t("father_name")}</TableHead>
            <TableHead className="text-start">{t("contact")}</TableHead>
            <TableHead className="text-start">{t("payment")}</TableHead>
            <TableHead className="text-start">{t("last_visit_date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>{skeleton}</>
          ) : certificatePayment ? (
            <React.Fragment>
              <TableRowIcon
                read={hasView}
                remove={false}
                edit={false}
                onEdit={async () => {}}
                item={certificatePayment}
                onRemove={async () => {}}
                onRead={watchOnClick}
              >
                <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                  {certificatePayment.id}
                </TableCell>
                <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                  {certificatePayment.passport_number}
                </TableCell>

                <TableCell
                  dir="ltr"
                  className="truncate rtl:text-sm-rtl rtl:text-end"
                >
                  {certificatePayment.full_name}
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="truncate rtl:text-sm-rtl rtl:text-end"
                >
                  {certificatePayment.father_name}
                </TableCell>
                <TableCell
                  dir="ltr"
                  className="rtl:text-end rtl:text-sm-rtl truncate"
                >
                  {certificatePayment?.contact}
                </TableCell>
                <TableCell dir="ltr" className="truncate">
                  {certificatePayment.payment_status_id ==
                  PaymentStatusEnum.paid
                    ? t("paid")
                    : t("unpaid")}
                </TableCell>
                <TableCell className="truncate">
                  {toLocaleDate(
                    new Date(certificatePayment.last_visit_date),
                    state
                  )}
                </TableCell>
              </TableRowIcon>
              {hasAdd && certificatePayment.payment_status_id == null && (
                <TableRow className=" py-8">
                  <TableCell colSpan={8} className="text-center pt-8 pb-4">
                    <NastranModel
                      size="lg"
                      isDismissable={false}
                      button={
                        <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                          {t("take_payment")}
                          <Coins className=" text-tertiary size-[18px] transition" />
                        </PrimaryButton>
                      }
                      showDialog={async () => true}
                    >
                      <TakePayment
                        amount={certificatePayment.amount}
                        visit_id={certificatePayment.visit_id}
                        onComplete={() => markAsPaid()}
                        passport_number={certificatePayment.passport_number}
                        currency={certificatePayment.currency}
                      />
                    </NastranModel>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ) : notFound ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className=" text-center text-red-400 ltr:text-xl-ltr drop-shadow-lg opacity-95 font-bold py-8 space-y-2"
              >
                <h1>{t("no_payment_found")}</h1>
                <TriangleAlert className=" text-red-400 size-[32px] mx-auto" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className=" text-center text-tertiary ltr:text-xl-ltr drop-shadow-lg opacity-95 font-bold py-8"
              >
                <h1>{t("search_payment")}</h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} 0 ${t("of")} ${1}`}</h1>
        <Pagination
          lastPage={1}
          onPageChange={async (page) =>
            await searchPerson(undefined, undefined, page)
          }
        />
      </div>
    </>
  );
}
