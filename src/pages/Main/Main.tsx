// import { useSuiClientInfiniteQuery, useSuiClientQuery } from "@mysten/dapp-kit";
// import { useEffect, useState } from "react";

import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  });

  // const { data, isPending, isError } = useSuiClientQueries({
  //   queries: [
  //     {
  //       method: "getAllBalances",
  //       params: {
  //         owner:
  //           "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  //       },
  //     },
  //     {
  //       method: "getOwnedObjects",
  //       params: {
  //         owner:
  //           "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  //       },
  //     },
  //   ],
  //   combine: (result) => {
  //     return {
  //       data: result.map((res) => res.data),
  //       isSuccess: result.every((res) => res.isSuccess),
  //       isPending: result.some((res) => res.isPending),
  //       isError: result.some((res) => res.isError),
  //     };
  //   },
  // });
  //   const [isLoadingMore, setIsLoadingMore] = useState(false);

  //   const balancesQuery = useSuiClientQuery("getAllBalances", {
  //     owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  //   });

  //   const ownedObjectsQuery = useSuiClientInfiniteQuery("getOwnedObjects", {
  //     owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  //     limit: 10,
  //   });

  //   const isPending = balancesQuery.isPending || ownedObjectsQuery.isPending;
  //   const isError = balancesQuery.isError || ownedObjectsQuery.isError;
  //   const error = balancesQuery.error || ownedObjectsQuery.error;

  //   const loadMoreObjects = () => {
  //     if (
  //       ownedObjectsQuery.hasNextPage &&
  //       !ownedObjectsQuery.isFetchingNextPage
  //     ) {
  //       setIsLoadingMore(true);
  //       ownedObjectsQuery.fetchNextPage();
  //     }
  //   };

  //   useEffect(() => {
  //     if (isLoadingMore && !ownedObjectsQuery.isFetchingNextPage) {
  //       setIsLoadingMore(false);
  //     }
  //   }, [isLoadingMore, ownedObjectsQuery.isFetchingNextPage]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message || "error"}</div>;
  }

  //   return (
  //     <div>
  //       <div className="text-2xl">Blockblock</div>
  //       <div className="text-lg">여기다 작업해주시면 됩니다.</div>

  //       <div className="mt-4">
  //         <pre>
  //           {JSON.stringify(balancesQuery.data, null, 2)}
  //         </pre>
  //       </div>

  //       <div className="mt-4">
  //         {ownedObjectsQuery.data?.pages.map((page, i) => (
  //           <div key={i}>
  //             <pre>
  //               {JSON.stringify(page.data, null, 2)}
  //             </pre>
  //           </div>
  //         ))}

  //         {ownedObjectsQuery.hasNextPage && (
  //           <button
  //             onClick={loadMoreObjects}
  //             disabled={ownedObjectsQuery.isFetchingNextPage}
  //           >
  //             더보기
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="text-2xl">Blockblock</div>
      <div className="text-lg">여기다 작업해주시면 됩니다.</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
