import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useState } from "react";
import Imports from "./_Imports";
import Structs from "./_Structs";

export default function Main() {
  const [imports, setImports] = useState<
    Record<string, Record<string, SuiMoveNormalizedStruct>>
  >({});
  const [structs, setStructs] = useState<
    Record<string, SuiMoveNormalizedStruct>
  >({});

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const PACKAGE =
    "0x0000000000000000000000000000000000000000000000000000000000000002";
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: PACKAGE,
    },
    {
      enabled: true,
    }
  );

  // 새로 고침 시 확인 알림
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = ""; // 일부 브라우저에서는 이 설정이 필수
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100">
      <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
      <br></br>
      <Imports data={data} imports={imports} setImports={setImports}></Imports>

      <Structs
        structs={structs}
        setStructs={setStructs}
        imports={imports}
      ></Structs>
    </div>
  );
}
