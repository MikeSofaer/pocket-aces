import PokerGame from "@/components/PokerGame";

export default async function Page({
  params,
}: {
  params: { contract_id: string };
}) {
  // Ensure you correctly extract the contractId from params
  const contractId = params.contract_id;

  // Return the PokerFrameSeq with the contractId prop
  return <PokerGame contractId={contractId} />;
}
