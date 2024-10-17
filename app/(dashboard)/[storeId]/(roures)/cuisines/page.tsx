import { db } from "@/lib/firebase";
import { getDocs, collection, doc } from "firebase/firestore";
import { format} from "date-fns"
import { CuisineClient } from "./components/client";
import { Cuisines } from "@/types-db";
import { CuisinesColumns } from "./components/columns";

const CuisinePage = async ({ params }: { params: { storeId: string } }) => {
  const cuisinesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisines[];
  
  const formattedCuisines : CuisinesColumns[] = cuisinesData.map(item => ({
    id: item.id,
    name:item.name,
    value: item.value,
    createdAt: item.createdAt ? format(item.createdAt.toDate(), "dd-MM-yyyy") : ""
  }))
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineClient data={formattedCuisines} />
      </div>
    </div>
  );
};

export default CuisinePage;
