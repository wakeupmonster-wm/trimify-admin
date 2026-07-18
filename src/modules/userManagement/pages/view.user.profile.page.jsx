import React from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// Import extracted components
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import GoalsNutritionCard from "../components/profile/GoalsNutritionCard";
import EngagementCard from "../components/profile/EngagementCard";
import ContactCard from "../components/profile/ContactCard";
import SubscriptionCard from "../components/profile/SubscriptionCard";
import SecurityCard from "../components/profile/SecurityCard";
import RecentLoginsCard from "../components/profile/RecentLoginsCard";
import RecentActivityTimelineCard from "../components/profile/RecentActivityTimelineCard";

const ViewUserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("userData: ", location.state?.userData);

  const userData = location.state?.userData || {};

  const formatDate = (dateStr, fmt = "MMM dd, yyyy") => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), fmt);
    } catch {
      return dateStr;
    }
  };

  const getYesNo = (val) => (val ? "Yes" : "No");

  let bmi = "-";
  if (userData.height && userData.weight) {
    const heightInM = parseFloat(userData.height) / 100;
    const weightInKg = parseFloat(userData.weight);
    if (heightInM > 0) {
      bmi = (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
  }

  const isActive = userData.status === "1" || userData.status === "Active";

  return (
    <Container>
      {/* Header */}
      <div className="mb-6">
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              heading="User Profile"
              icon={<User className="w-9 h-9 text-white" />}
              color="bg-app-primary2 shadow-app-primary2"
              subheading="Detailed information and activity overview of the user."
            />
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className="w-full xs:w-auto border-slate-300/60 text-slate-600 hover:bg-slate-50 rounded-xl px-4 h-10 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
              </Button>
            </div>
          </div>
        </Header>
      </div>

      <ProfileHeader
        userData={userData}
        isActive={isActive}
        formatDate={formatDate}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-12">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <PersonalInfoCard
            userData={userData}
            formatDate={formatDate}
            bmi={bmi}
            getYesNo={getYesNo}
          />
          <GoalsNutritionCard userData={userData} />
          <EngagementCard userData={userData} />
          <RecentActivityTimelineCard userData={userData} />
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
          <ContactCard userData={userData} />
          <SubscriptionCard userData={userData} formatDate={formatDate} />
          <SecurityCard userData={userData} />
          <RecentLoginsCard userData={userData} />
        </div>
      </div>
    </Container>
  );
};

export default ViewUserProfilePage;
