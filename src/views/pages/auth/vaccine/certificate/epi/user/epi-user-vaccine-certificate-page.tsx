import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import VaccineCertificateHeader from "./vaccine-certificate-header";
import { VaccineCertificateTable } from "./vaccine-certificate-table";
export interface VaccineCertificatePageProps {}
export default function VaccineCertificatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });

  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {t("certificate")}
        </BreadcrumbItem>
      </Breadcrumb>
      <VaccineCertificateHeader />
      <VaccineCertificateTable />
    </div>
  );
}
