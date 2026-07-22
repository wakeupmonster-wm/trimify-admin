import React from "react";
import { User, Calendar, Ruler, Scale, Activity, Shapes, Dumbbell, Leaf } from "lucide-react";
import { SectionCard, GridItem } from "./SharedComponents";
import { LuUserRound } from "react-icons/lu";

const PersonalInfoCard = ({ userData, formatDate, bmi, getYesNo }) => {
  return (
    <SectionCard title="Personal Information" subheading="Basic details and biometrics" icon={LuUserRound}>
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6">
          <GridItem label="Gender" value={userData.gender} icon={LuUserRound} iconColor="text-slate-400" />
          <GridItem label="Date of Birth" value={formatDate(userData.dob)} icon={Calendar} iconColor="text-slate-400" />
          <GridItem label="Height" value={userData.height ? `${userData.height} cm` : "-"} icon={Ruler} iconColor="text-slate-400" />
          <GridItem label="Weight" value={userData.weight ? `${userData.weight} kg` : "-"} icon={Scale} iconColor="text-slate-400" />
          <GridItem label="BMI" value={bmi} icon={Activity} iconColor="text-slate-400" />
          <GridItem label="Body Shape" value={userData.body_shape} icon={Shapes} iconColor="text-slate-400" />
          <GridItem label="Fitness Level" value={userData.fitness_level} icon={Dumbbell} iconColor="text-slate-400" />
          <GridItem label="Vegetarian" value={getYesNo(userData.vegetarian)} icon={Leaf} iconColor="text-slate-400" />
       </div>
    </SectionCard>
  );
};

export default PersonalInfoCard;
