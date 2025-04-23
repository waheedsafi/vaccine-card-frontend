import { FileText } from "lucide-react";
import { useContext } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { dateObjectToString } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Dose, Vaccine } from "@/database/tables";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";

export default function AddVaccineDetail() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const { t } = useTranslation();
  const [state] = useGlobalState();
  // const [vaccine, setVaccine] = useState<Vaccine>({
  //   id: "",
  //   vaccine_type: { id: "", name: "" },
  //   registration_number: "",
  //   volume: "",
  //   page: "",
  //   registration_date: new DateObject(new Date()),
  //   vaccine_center: { id: "", name: "" },
  //   dose: [],
  // });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      vaccine: { ...userData.vaccine, [name]: value },
    });
  };

  const addDose = () => {
    let vaccine = userData?.vaccine;

    if (vaccine) {
      if (vaccine.doses) {
        const dose = {
          batch_number: userData.batch_number,
          vaccine_date: userData.vaccine_date,
        };
        const updateVacine = { ...vaccine, doses: [dose, ...vaccine.doses] };
        setUserData({ ...userData, vaccine: updateVacine });
      }
    } else {
      console.log(vaccine);

      const dose = {
        batch_number: userData.batch_number,
        vaccine_date: userData.vaccine_date,
      };
      const vac = {
        vaccine_type: userData?.vaccine_type,
        registration_number: userData?.registration_number,
        volume: userData?.volume,
        page: userData?.volume,
        registration_date: userData?.registration_date,
        vaccine_center: userData?.vaccine_center,
        dose: [dose],
      };
      setUserData({ ...userData, vaccine: vac });
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-center mt-4 gap-y-3 w-full lg:w-full">
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({
            ...userData,
            vaccine: { ...userData.vaccine, vaccine_type: selection },
          })
        }
        lable={t("vaccine_type")}
        selectedItem={userData["vaccine_type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("vaccine_type")}
        apiUrl={"vaccine/types"}
        cacheData={false}
        mode="single"
      />
      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("registration_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.registration_date}
        dateOnComplete={(date: DateObject) => {
          setUserData({
            ...userData,
            vaccine: { ...userData.vaccine, registration_date: date },
          });
        }}
        className="py-3 w-full"
        errorMessage={error.get("registration_date")}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("registration_number")}
        placeholder={t("enter")}
        defaultValue={userData["registration_number"]}
        type="text"
        name="registration_number"
        errorMessage={error.get("registration_number")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("volume")}
        placeholder={t("enter")}
        defaultValue={userData["volume"]}
        type="text"
        name="volume"
        errorMessage={error.get("volume")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("page")}
        placeholder={t("enter")}
        defaultValue={userData["page"]}
        type="text"
        name="page"
        errorMessage={error.get("page")}
        onChange={handleChange}
        startContent={
          <FileText className="text-tertiary size-[18px] pointer-events-none" />
        }
        required={true}
        requiredHint={`* ${t("required")}`}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({
            ...userData,
            vaccine: { ...userData.vaccine, vaccine_center: selection },
          })
        }
        lable={t("vaccine_center")}
        selectedItem={userData["vaccine_center"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("vaccine_center")}
        apiUrl={"vaccine/centers"}
        cacheData={false}
        mode="single"
      />
      <div className="col-span-full border-t mt-20 pt-6 relative flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-center gap-y-3 w-full lg:w-full">
        <h1 className="absolute uppercase text-tertiary font-bold ltr:text-[22px] bg-card -top-5">
          {t("dose")}
        </h1>
        <CustomInput
          size_="sm"
          dir="ltr"
          className="rtl:text-end"
          lable={t("batch_number")}
          placeholder={t("enter")}
          defaultValue={userData["batch_number"]}
          type="text"
          name="batch_number"
          errorMessage={error.get("batch_number")}
          onChange={handleChange}
          startContent={
            <FileText className="text-tertiary size-[18px] pointer-events-none" />
          }
          required={true}
          requiredHint={`* ${t("required")}`}
        />
        <CustomDatePicker
          placeholder={t("select_a_date")}
          lable={t("vaccine_date")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.vaccine_date}
          dateOnComplete={(date: DateObject) => {
            setUserData({
              ...userData,
              vaccine: { ...userData.vaccine, vaccine_date: date },
            });
          }}
          className="py-3 w-full"
          errorMessage={error.get("vaccine_date")}
        />
        <PrimaryButton
          onClick={addDose}
          className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr col-span-2"
        >
          {t("add_dose")}
        </PrimaryButton>
        <div className=" col-span-full border w-fit p-4 rounded-md">
          <ul className="flex gap-x-3 font-bold ltr:text-2xl-ltr capitalize pb-1 text-primary/90">
            <li className=" min-w-[80px] max-w-[80px] text-start">
              {t("dose")}
            </li>
            <li className=" min-w-[160px] max-w-[160px] text-start">
              {t("batch_number")}
            </li>
            <li className=" min-w-[200px] max-w-[200px] text-start">
              {t("vaccine_date")}
            </li>
          </ul>
          {userData?.vaccine?.doses &&
            userData?.vaccine?.doses.map((dose: any, index: number) => (
              <ul
                key={index}
                className="flex gap-x-3 font-bold ltr:text-[16px] text-primary/95 border-t py-2"
              >
                <li className="min-w-[80px] max-w-[80px] text-start ltr:text-xl-ltr">
                  {index + 1}
                </li>
                <li className="min-w-[160px] max-w-[160px] text-start truncate ltr:text-xl-ltr">
                  {dose.batch_number}
                </li>
                <li className="min-w-[200px] max-w-[260px] text-start truncate ltr:text-xl-ltr">
                  {dateObjectToString(dose.vaccine_date as DateObject, state)}
                </li>
              </ul>
            ))}
        </div>
      </div>
      <div className="col-span-full flex flex-col border-t mt-20 pt-6 space-y-4 pb-12 relative">
        <h1 className="absolute uppercase text-tertiary font-bold ltr:text-[22px] bg-card -top-5">
          {t("vaccines")}
        </h1>
        <PrimaryButton className="rtl:text-lg-rtl font-semibold ltr:text-md-ltr">
          {t("add")}
        </PrimaryButton>
        <Table className="bg-card rounded-md">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-start px-1">
                {t("registration_number")}
              </TableHead>
              <TableHead className="text-start">{t("vaccine_type")}</TableHead>
              <TableHead className="text-start">
                {t("registration_date")}
              </TableHead>
              <TableHead className="text-start">{t("dose")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
            {userData.vaccines &&
              userData.vaccines.map((item: Vaccine, index: number) => (
                <TableRowIcon
                  read={false}
                  remove={true}
                  edit={true}
                  onEdit={async () => {}}
                  key={index}
                  item={item}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                    {item.registration_number}
                  </TableCell>
                  <TableCell className="truncate">
                    {dateObjectToString(item.registration_date, state)}
                  </TableCell>
                </TableRowIcon>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
