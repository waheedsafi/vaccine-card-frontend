import { Person } from "@/database/tables";
import CachedImage from "@/components/custom-ui/image/CachedImage";

export interface UserEditHeaderProps {
  userData: Person | undefined;
}

export default function PersonEditHeader(props: UserEditHeaderProps) {
  const { userData } = props;

  return (
    <div className="self-center text-center">
      <CachedImage
        src={undefined}
        alt="Avatar"
        shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
        routeIdentifier={"profile"}
      />
      <h1 className="text-primary font-semibold rtl:text-2xl-rtl ltr:text-4xl-ltr">
        {userData?.full_name}
      </h1>
      <h1
        dir="ltr"
        className="text-primary rtl:text-md-rtl ltr:text-xl-ltr font-bold"
      >
        {userData?.contact}
      </h1>
    </div>
  );
}
