export const revalidate = 0;

import { getPaginaterUsers } from "@/actions";
import { Pagination, Title } from "@/components";

import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";

interface Props {
  searchParams: Promise<{page?:string}>
}
export default async function UsersPage({searchParams}:Props) {
  
  const page = (await searchParams).page ? Number((await searchParams).page) : 1;
  //TODO: agregar filtro para buscar ordenes por usuario o nombres.
  const { ok, users = [], totalPages = 1 } = await getPaginaterUsers({page});
  if (!ok) {
    redirect("/auth/login");
  }
  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users}/>
        <Pagination totalPages={totalPages}/>
      </div>
    </>
  );
}
