import { useTranslation } from "react-i18next";

import { useEpiAuthState } from "@/context/AuthContextProvider";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router";

export default function EpiProfilePage() {
  const { user } = useEpiAuthState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  return (
    <div className="flex flex-col gap-y-6 px-3 mt-2">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("profile")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{user?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      EpiProfilePage
    </div>
  );
}
