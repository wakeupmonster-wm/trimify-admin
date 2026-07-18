import React from "react";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import Header from "@/components/common/header";
import { Info } from "lucide-react";

const AboutUsPage = () => {
  return (
    <Container>
      <div className="space-y-8">
        <Header>
          <div className="flex-1 min-w-0">
            <PageHeader
              heading="About Us"
              icon={<Info className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-md"
              subheading="Edit the About Us page content here."
            />
          </div>
        </Header>

        <div className="bg-white p-6 rounded-md shadow-sm border text-center text-slate-500">
          Content Editor Coming Soon
        </div>
      </div>
    </Container>
  );
};

export default AboutUsPage;
