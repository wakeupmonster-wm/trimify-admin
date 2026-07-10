import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  IconHeart,
  IconSmoking,
  IconGlassFull,
  IconBarbell,
  IconSchool,
  IconPray,
  IconToolsKitchen2,
  IconUser,
  IconZodiacGemini,
  IconUsers,
  IconMessage2,
  IconLanguage,
  IconMusic,
  IconMovie,
  IconBook,
  IconPaw,
  IconMoonStars,
  IconDeviceMobile,
  IconPlaneDeparture,
  IconActivity,
  IconStar,
} from "@tabler/icons-react";
import { BiBookmark } from "react-icons/bi";
import { cn } from "@/lib/utils";
import DashboardHead from "@/components/shared/dashboard.head";
import { LuHeartHandshake, LuUserRoundCheck } from "react-icons/lu";
import { MdOutlineStarOutline } from "react-icons/md";

export const AttributesTab = ({ attributes }) => {
  // Dynamic sections configuration
  const basicAttributes = [
    {
      label: "Zodiac",
      value: attributes?.zodiac,
      icon: <IconZodiacGemini size={16} />,
    },
    {
      label: "Education",
      value: attributes?.education,
      icon: <IconSchool size={16} />,
    },
    {
      label: "Family Plans",
      value: attributes?.familyPlans,
      icon: <IconUsers size={16} />,
    },
    {
      label: "Personality Type",
      value: attributes?.personalityType,
      icon: <LuUserRoundCheck size={16} />,
    },
    {
      label: "Communication Style",
      value: attributes?.communicationStyle,
      icon: <IconMessage2 size={16} />,
    },
    {
      label: "Love Style",
      value: attributes?.loveStyle,
      icon: <IconHeart size={16} />,
    },
    {
      label: "Relationship Goals",
      value: attributes?.relationshipGoal,
      icon: <LuHeartHandshake size={16} />,
      valueColor: "text-brand-aqua bg-brand-aqua/5",
    },
  ];

  const lifestyleAttributes = [
    { label: "Pets", value: attributes?.pets, icon: <IconPaw size={16} /> },
    {
      label: "Drinking Habits",
      value: attributes?.drinking,
      icon: <IconGlassFull size={16} />,
    },
    {
      label: "Smoking Habits",
      value: attributes?.smoking,
      icon: <IconSmoking size={16} />,
    },
    {
      label: "Workout",
      value: attributes?.workout,
      icon: <IconBarbell size={16} />,
    },
    {
      label: "Dietary Preferences",
      value: attributes?.dietary,
      icon: <IconToolsKitchen2 size={16} />,
    },
    {
      label: "Social Media Presence",
      value: attributes?.socialMedia,
      icon: <IconDeviceMobile size={16} />,
    },
    {
      label: "Sleeping Habits",
      value: attributes?.sleeping,
      icon: <IconMoonStars size={16} />,
    },
  ];

  const interestAttributes = [
    {
      label: "Interests",
      items: attributes?.interests,
      icon: <IconStar size={16} />,
      type: "badges",
    },
    {
      label: "Languages",
      items: attributes?.languages,
      icon: <IconLanguage size={16} />,
      type: "badges",
    },
    {
      label: "Religion",
      value: attributes?.religion,
      icon: <IconPray size={16} />,
    },
  ];

  const favoriteAttributes = [
    {
      label: "Music",
      items: attributes?.music,
      icon: <IconMusic size={16} />,
      type: "badges",
    },
    {
      label: "Movies",
      items: attributes?.movies,
      icon: <IconMovie size={16} />,
      type: "badges",
    },
    {
      label: "Books",
      items: attributes?.books,
      icon: <IconBook size={16} />,
      type: "badges",
    },
    {
      label: "Travel",
      items: attributes?.travel,
      icon: <IconPlaneDeparture size={16} />,
      type: "badges",
    },
  ];

  return (
    <TabsContent
      value="attributes"
      className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-offset-0 focus-visible:ring-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* 1. BASICS */}
        <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white transition-all duration-300">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Basics"
                subtitle="Core profile attributes"
                Icon={IconUser}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
              <Badge
                variant="outline"
                className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
              >
                {basicAttributes.length} Attributes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5">
            <div>
              {basicAttributes.map((attr, i) => (
                <AttributeRow
                  key={i}
                  icon={attr.icon}
                  label={attr.label}
                  value={attr.value}
                  valueColor={attr.valueColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. LIFESTYLE */}
        <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white transition-all duration-300">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Lifestyle"
                subtitle="Daily habits and preferences"
                Icon={IconActivity}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
              <Badge
                variant="outline"
                className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
              >
                {lifestyleAttributes.length} Attributes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5">
            <div>
              {lifestyleAttributes.map((attr, i) => (
                <AttributeRow
                  key={i}
                  icon={attr.icon}
                  label={attr.label}
                  value={attr.value}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. INTERESTS & LANGUAGES */}
        <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white transition-all duration-300">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Interests & Languages"
                subtitle="Hobbies and spoken languages"
                Icon={MdOutlineStarOutline}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
              <Badge
                variant="outline"
                className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
              >
                {interestAttributes.length} Attributes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5">
            {interestAttributes.map((attr, i) =>
              attr.type === "badges" ? (
                <AttributeRowWithBadges
                  key={i}
                  icon={attr.icon}
                  label={attr.label}
                  items={attr.items}
                />
              ) : (
                <AttributeRow
                  key={i}
                  icon={attr.icon}
                  label={attr.label}
                  value={attr.value}
                />
              ),
            )}
          </CardContent>
        </Card>

        {/* 4. FAVORITES & PREFERENCES */}
        <Card className="border-slate-200 shadow-sm rounded-2xl gap-2 overflow-hidden bg-white transition-all duration-300">
          <CardHeader className="px-5 border-b border-slate-200">
            <div className="flex items-center justify-between pb-4">
              <DashboardHead
                title="Favorites & Preferences"
                subtitle="Entertainment and leisure"
                Icon={BiBookmark}
                iconColor="text-slate-600"
                iconBg="bg-slate-100/50"
              />
              <Badge
                variant="outline"
                className="bg-slate-100/50 rounded-xl text-muted-foreground border-slate-200 px-3 py-1 font-bold text-[10px]"
              >
                {favoriteAttributes.length} Attributes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5">
            {favoriteAttributes.map((attr, i) => (
              <AttributeRowWithBadges
                key={i}
                icon={attr.icon}
                label={attr.label}
                items={attr.items}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

// --- SUB-COMPONENTS ---

const AttributeRow = ({ icon, label, value, valueColor, className }) => (
  <div
    className={cn(
      "flex items-center justify-between py-3 border-b border-slate-200/50 group last:border-none",
      className,
    )}
  >
    <div className="flex items-center gap-4">
      <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <p className="text-[13px] font-medium text-foreground/60">{label}</p>
    </div>
    {value ? (
      <p
        className={cn(
          "bg-white border border-slate-200 font-medium capitalize text-[12px] rounded-md px-2.5 py-1",
          valueColor || "text-foreground/80",
        )}
      >
        {value}
      </p>
    ) : (
      <p className="text-[13px] text-slate-300 italic font-medium">Not Set</p>
    )}
  </div>
);

const AttributeRowWithBadges = ({ icon, label, items }) => {
  const itemsArray = Array.isArray(items) ? items : items ? [items] : [];

  return (
    <div className="flex items-start justify-between gap-6 py-3 group border-b border-slate-200/50 last:border-none">
      <div className="flex items-center gap-4">
        <div className="p-1.5 bg-slate-100/50 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5">
          {icon}
        </div>
        <p className="text-[13px] font-medium text-foreground/60">{label}</p>
      </div>
      <div className="flex flex-wrap justify-end gap-2 max-w-max">
        {itemsArray.length > 0 ? (
          itemsArray.map((item, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-brand-aqua/5 border border-brand-aqua/30 text-brand-aqua font-medium text-[12px] capitalize rounded-md px-2.5 py-1 shadow-none"
            >
              {item}
            </Badge>
          ))
        ) : (
          <p className="text-[13px] text-slate-300 italic font-medium">
            Not Set
          </p>
        )}
      </div>
    </div>
  );
};
