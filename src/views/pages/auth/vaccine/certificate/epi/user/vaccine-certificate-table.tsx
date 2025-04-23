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
import { useGlobalState } from "@/context/GlobalStateContext";
import { PersonCertificate, UserPermission } from "@/database/tables";
import { CACHE, PermissionEnum } from "@/lib/constants";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";

import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import Pagination from "@/components/custom-ui/table/Pagination";
import { toLocaleDate } from "@/lib/utils";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { ListFilter, Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import SecondaryButton from "@/components/custom-ui/button/SecondaryButton";
import CustomSelect from "@/components/custom-ui/select/CustomSelect";
import { DateObject } from "react-multi-date-picker";
import useCacheDB from "@/lib/indexeddb/useCacheDB";
import FilterDialog from "@/components/custom-ui/dialog/filter-dialog";
import {
  PersonCertificatePaginationData,
  PersonCertificateSearch,
} from "@/lib/types";
import AddCertificate from "./add/add-certificate";

export function VaccineCertificateTable() {
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
      setLoading(true);
      const response = await axiosClient.get("epi/certificate/search", {
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
      const fetch = response.data.personCertificates
        .data as PersonCertificate[];
      const lastPage = response.data.person_certificates.last_page;
      const totalItems = response.data.person_certificates.total;
      const perPage = response.data.person_certificates.per_page;
      const currentPage = response.data.person_certificates.current_page;
      setPersonCertificates({
        filterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
        unFilterList: {
          data: fetch,
          lastPage: lastPage,
          totalItems: totalItems,
          perPage: perPage,
          currentPage: currentPage,
        },
      });
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
  const [personCertificates, setPersonCertificates] = useState<{
    filterList: PersonCertificatePaginationData;
    unFilterList: PersonCertificatePaginationData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
    unFilterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [state] = useGlobalState();

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
    PermissionEnum.vaccine_certificate.name
  ) as UserPermission;
  const hasView = per?.view;
  const hasAdd = per?.add;

  const watchOnClick = async (personCertificate: PersonCertificate) => {
    const userId = personCertificate.id;
    navigate(`/users/${userId}`);
  };
  return (
    <>
      <div className="flex flex-col sm:items-baseline sm:flex-row rounded-md bg-card gap-2 flex-1 px-2 py-2 mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
                {t("add")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <AddCertificate />
          </NastranModel>
        )}

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
                  {
                    name: "contact",
                    translate: t("contact"),
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
            <TableHead className="text-start">{t("gender")}</TableHead>
            <TableHead className="text-start">{t("last_visit_date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
          {loading ? (
            <>{skeleton}</>
          ) : (
            personCertificates.filterList.data.map(
              (item: PersonCertificate) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={false}
                  onEdit={async () => {}}
                  key={item.id}
                  item={item}
                  onRemove={async () => {}}
                  onRead={watchOnClick}
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
                    {item?.contact == "null" ? "" : item?.contact}
                  </TableCell>
                  <TableCell
                    dir="ltr"
                    className="truncate rtl:text-sm-rtl rtl:text-end"
                  >
                    {item.contact}
                  </TableCell>
                  <TableCell
                    dir="ltr"
                    className="truncate rtl:text-sm-rtl rtl:text-end"
                  >
                    {item.gender}
                  </TableCell>
                  <TableCell className="truncate">
                    {toLocaleDate(new Date(item.last_visit_date), state)}
                  </TableCell>
                </TableRowIcon>
              )
            )
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between rounded-md bg-card flex-1 p-3 items-center">
        <h1 className="rtl:text-lg-rtl ltr:text-md-ltr font-medium">{`${t(
          "page"
        )} ${personCertificates.unFilterList.currentPage} ${t("of")} ${
          personCertificates.unFilterList.lastPage
        }`}</h1>
        <Pagination
          lastPage={personCertificates.unFilterList.lastPage}
          onPageChange={async (page) =>
            await searchPerson(undefined, undefined, page)
          }
        />
      </div>
    </>
  );
}
