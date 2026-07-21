import React, { useEffect } from "react";
import { Container } from "@/components/common/container";
import Header from "@/components/common/header";
import { PageHeader } from "@/components/common/headSubhead";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUserProfile, clearCurrentUser } from "../store/user.slice";

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
import UserProfileSkeleton from "../components/profile/UserProfileSkeleton";

const ViewUserProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, currentUserLoading } = useSelector(
    (state) => state.usersManagement,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleUserProfile(id));
    }
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  const rawUserData = currentUser || location.state?.userData || {};

  const formatDate = (dateStr, fmt = "MMM dd, yyyy") => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), fmt);
    } catch {
      return dateStr;
    }
  };

  const userData = {
    ...rawUserData,
    // Engagement mappings
    totalLogins: rawUserData.engagement_stats?.total_logins,
    workouts: rawUserData.engagement_stats?.workouts_completed,
    programs: rawUserData.engagement_stats?.programs_enrolled,
    blogsRead: rawUserData.engagement_stats?.blogs_read,
    sessions: rawUserData.engagement_stats?.sessions_completed,
    daysActive: rawUserData.engagement_stats?.days_active,
    // Activities mappings
    activities: (rawUserData.recent_activities || []).map((act) => ({
      id: act.id,
      title: act.title,
      desc: act.description,
      time: formatDate(act.created_at, "h:mm a"),
    })),
    // Logins mappings
    recentLogins: (rawUserData.recent_logins || []).map((login) => ({
      browser: login.browser,
      loc: login.location,
      date: formatDate(login.login_at, "MMM dd, yyyy"),
      time: formatDate(login.login_at, "h:mm a"),
      current: login.is_current_session,
    })),
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

  if (currentUserLoading && !currentUser && !location.state?.userData) {
    return <UserProfileSkeleton />;
  }

  return (
    <Container>
      <div className="w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-8 min-w-0">
        {/* Header */}
        <Header>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex min-w-0 w-full lg:w-auto">
              <PageHeader
                heading="User Profile"
                icon={
                  <User className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />
                }
                color="bg-app-primary2 shadow-app-primary2"
                subheading="Detailed information and activity overview of the user."
              />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-max md:w-auto shrink-0 mt-2 sm:mt-4 xl:mt-0">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className="w-full sm:w-auto flex-1 xl:flex-none border-slate-300/60 text-slate-600 hover:bg-slate-50 rounded-xl px-4 sm:px-5 h-11 sm:h-10 flex items-center justify-center gap-2 text-sm sm:text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Back to Users</span>
              </Button>
            </div>
          </div>
        </Header>

        <ProfileHeader
          userData={userData}
          isActive={isActive}
          formatDate={formatDate}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 pb-8 sm:pb-12 min-w-0">
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
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

          <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6 min-w-0">
            <ContactCard userData={userData} />
            <SubscriptionCard userData={userData} formatDate={formatDate} />
            <SecurityCard userData={userData} />
            <RecentLoginsCard userData={userData} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ViewUserProfilePage;
