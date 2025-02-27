export default async function Page({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  const contract_id = (await params).contract_id;
  return <div>My Table: {contract_id} </div>;
}
