"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CuisinesColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface CuisineClientProps {
  data: CuisinesColumns[];
}

export const CuisineClient = ({ data }: CuisineClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisines (${data.length})`}
          description="Manage Cuisines for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/cuisines/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add new
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="Api calls for cuisines"/>
      <Separator/>
      <ApiList entityName="cuisines" entituNameId="cuisineId"/>
    </>
  );
};
