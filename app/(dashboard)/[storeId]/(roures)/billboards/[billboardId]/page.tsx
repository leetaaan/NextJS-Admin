import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  const billBoard = (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data() as Billboards;

  return <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billBoard}/>
    </div>
  </div>;
};

export default BillboardPage;
