import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { CertificatePaymentTable } from "./certificate-payment-table";
export interface VaccineCertificatePageProps {}
export default function FinanceCertificatePaymentUserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/", { replace: true });

  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {t("certificate_payment")}
        </BreadcrumbItem>
      </Breadcrumb>
      <CertificatePaymentTable />
    </div>
  );
}
