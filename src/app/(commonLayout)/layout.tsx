import Navbar from "@/components/(shared)/Navbar";
import { userService } from "@/services/user.service";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = userService.getSession();
  return (
    <>
      <div className="container mx-auto px-4">
        <Navbar userInfo={data?.data?.user}></Navbar>
        {children}
      </div>
    </>
  );
}
