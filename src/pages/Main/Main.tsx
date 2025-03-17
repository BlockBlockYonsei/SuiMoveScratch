import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  });

  if (isPending) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error: {error?.message || "error"}</div>;
  }

  return (
    <div>
      <div className="text-2xl">Blockblock</div>
      <div className="text-lg">여기다 작업해주시면 됩니다.</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
