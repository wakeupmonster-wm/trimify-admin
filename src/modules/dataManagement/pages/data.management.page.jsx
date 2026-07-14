import React from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import { Database, UploadCloud } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkFoodUploadTab } from "../components/bulk-food-upload.tab";

const DataManagementPage = () => {
  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <PageHeader
            heading="Data Management"
            icon={<Database className="w-9 h-9 text-white" />}
            color="bg-brand-blue shadow-blue-200"
            subheading="Manage bulk data imports and platform datasets."
          />
        </Header>

        <Tabs defaultValue="bulk-food-upload" className="w-full">
          <TabsList className="h-11 p-1 bg-slate-200/50 rounded-xl w-full max-w-max grid grid-cols-2">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-5 py-2 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brand-aqua transition-all duration-300"
            >
              <Database size={16} />
              <span className="font-semibold">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="bulk-food-upload"
              className="rounded-lg px-5 py-2 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brand-aqua transition-all duration-300"
            >
              <UploadCloud size={16} />
              <span className="font-semibold">Bulk Food Upload</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="outline-none space-y-6 mt-6">
            <p className="text-sm text-muted-foreground">
              Select the "Bulk Food Upload" tab to view the nutrition/food database.
            </p>
          </TabsContent>

          <TabsContent value="bulk-food-upload" className="outline-none mt-6">
            <BulkFoodUploadTab />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default DataManagementPage;
