import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { BookDashed, Phone, UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

export default function AddPersonalDetail() {
  const { t } = useTranslation();

  const { userData, setUserData, error } = useContext(StepperContext);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col mt-10 w-full lg:w-[60%] 2xl:w-1/3 gap-y-6 pb-12">
      <CustomInput
        required={true}
        lable={t("full_name")}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        name="full_name"
        defaultValue={userData["full_name"]}
        placeholder={t("enter_your_name")}
        type="text"
        errorMessage={error.get("full_name")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        required={true}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        lable={t("father_name")}
        name="father_name"
        defaultValue={userData["father_name"]}
        placeholder={t("enter_name")}
        type="text"
        errorMessage={error.get("father_name")}
        onBlur={handleChange}
        startContent={
          <UserRound className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("contact")}
        placeholder={t("enter_ur_pho_num")}
        defaultValue={userData["contact"]}
        type="text"
        name="contact"
        errorMessage={error.get("contact")}
        onChange={handleChange}
        startContent={
          <Phone className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("passport_number")}
        placeholder={t("enter")}
        defaultValue={userData["passport_number"]}
        type="text"
        name="passport_number"
        errorMessage={error.get("passport_number")}
        onChange={handleChange}
        startContent={
          <BookDashed className="text-tertiary size-[18px] pointer-events-none" />
        }
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["gender"]: selection })
        }
        lable={t("gender")}
        selectedItem={userData["gender"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("gender")}
        apiUrl={"genders"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["province"]: selection })
        }
        lable={t("province")}
        selectedItem={userData["province"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("province")}
        apiUrl={"provinces/" + 1}
        mode="single"
      />
      {userData.province && (
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          onSelect={(selection: any) =>
            setUserData({ ...userData, ["district"]: selection })
          }
          lable={t("district")}
          required={true}
          selectedItem={userData["district"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("district")}
          apiUrl={"districts/" + userData?.province?.id}
          mode="single"
          key={userData?.province?.id}
        />
      )}
      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("date_of_birth")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.date_of_birth}
        dateOnComplete={(date: DateObject) => {
          setUserData({ ...userData, date_of_birth: date });
        }}
        className="py-3 w-full"
        errorMessage={error.get("date_of_birth")}
      />

      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["nationality"]: selection })
        }
        lable={t("nationality")}
        selectedItem={userData["nationality"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("nationality")}
        apiUrl={"nationalities"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["travel_type"]: selection })
        }
        lable={t("travel_type")}
        selectedItem={userData["travel_type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("travel_type")}
        apiUrl={"travel/types"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["destina_country"]: selection })
        }
        lable={t("destina_country")}
        selectedItem={userData["destina_country"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("destina_country")}
        apiUrl={"countries"}
        mode="single"
      />
    </div>
  );
}
