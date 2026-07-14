import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/common/headSubhead";
import { Button } from "@/components/ui/button";
import { Eye, ShieldCheck } from "lucide-react";

export default function PrivacyAndPolicyPage() {
  return (
    <Container className="space-y-8">
      {/* ══════════ Sticky Header ══════════ */}
      <header className="sticky top-0 z-20 px-6 bg-white backdrop-blur-md">
        <div className="w-full mx-auto py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <PageHeader
            heading="Privacy & Policy"
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            color="bg-brand-blue"
            subheading="Update user data protection guidelines."
          />

          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <Button
              // onClick={handleViewPreview}
              className="h-9 group shadow-sm bg-white text-slate-500 border border-slate-200 transition-all duration-300 font-semibold text-[11px] uppercase tracking-wider rounded-lg gap-2 px-3.5 hover:bg-white hover:text-slate-500"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300" />
              View
            </Button>

            <Button
              // onClick={handleSaveAll}
              // disabled={isSaving || loading}
              className="bg-brand-aqua hover:bg-brand-hoverAqua text-white font-semibold text-xs gap-2 h-9 px-4 shadow-sm rounded-md transition-all border-none"
            >
              {/* {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1" />
              )} */}
              {/* {isSaving ? "Saving…" : "Save Changes"} */}
              Save Changes
            </Button>
          </div>
        </div>
      </header>
    </Container>
  );
}
