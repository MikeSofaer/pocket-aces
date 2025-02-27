export default async function Page({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  console.log(params);
  return <div>This is the tables index: {params.toString()} </div>;
}
