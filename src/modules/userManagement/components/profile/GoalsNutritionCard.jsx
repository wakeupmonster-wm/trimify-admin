import React from "react";
import { Heart, ListTodo, Droplet, Target, Scale, Footprints, Flame, Wheat, Beef, Utensils } from "lucide-react";
import { SectionCard } from "./SharedComponents";

const GoalsNutritionCard = ({ userData }) => {
  return (
    <SectionCard
      title="Goals & Nutrition"
      subheading="Daily targets and fitness objectives"
      icon={Heart}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:bg-slate-100/60 hover:border-slate-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Weight Goal
            </span>
          </div>
          <span className="text-2xl font-black text-slate-800 mt-1">
            {userData.weight_goal || "-"}
            <span className="text-sm font-semibold text-slate-400 ml-1">
              kg
            </span>
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:bg-slate-100/60 hover:border-slate-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Main Goal
            </span>
          </div>
          <span className="text-lg font-bold text-slate-800 mt-1 leading-tight">
            {userData.main_goal || "-"}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:bg-slate-100/60 hover:border-slate-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
              <Footprints className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Target Steps
            </span>
          </div>
          <span className="text-2xl font-black text-slate-800 mt-1">
            {userData.targetSteps || "6000"}
            <span className="text-sm font-semibold text-slate-400 ml-1">
              steps
            </span>
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ListTodo className="w-3.5 h-3.5" /> Daily Nutrition Targets
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 hover:border-slate-300 transition-all shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3" /> Calories
            </span>
            <span className="text-[15px] font-bold text-slate-800">
              {userData.calories_goal || "-"}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 hover:border-slate-300 transition-all shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Wheat className="w-3 h-3" /> Carbs
            </span>
            <span className="text-[15px] font-bold text-slate-800">
              {userData.carbs_goal || "-"}g
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 hover:border-slate-300 transition-all shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Beef className="w-3 h-3" /> Protein
            </span>
            <span className="text-[15px] font-bold text-slate-800">
              {userData.protein_goal || "-"}g
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 hover:border-slate-300 transition-all shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Fat
            </span>
            <span className="text-[15px] font-bold text-slate-800">
              {userData.fat_goal || "-"}g
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100/60 hover:border-slate-300 transition-all shadow-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Droplet className="w-3 h-3" /> Water
            </span>
            <span className="text-[15px] font-bold text-slate-800">
              {userData.water_goal || "-"}ml
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default GoalsNutritionCard;
