import React, { useState } from "react";
import { CheckCircle2, Calendar, Clock, Mail, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import NotificationDialogForm from "./NotificationDialogForm";


const ProfileHeader = ({ userData, isActive, formatDate }) => {
  const [emailOpen, setEmailOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);

  return (
    <div className="bg-slate-50 rounded-3xl shadow-sm border border-slate-300/60 hover:border-blue-200 p-6 md:p-8 mb-6 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
       {/* Decorative Blob */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
       
       {/* Left Side: Avatar & Core Info */}
       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 text-brand-blue flex items-center justify-center font-black text-3xl shadow-sm border border-brand-blue/10">
              {userData.name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            {/* <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}>
               {isActive && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div> */}
          </div>
          <div className="flex flex-col gap-2.5">
             <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize">{userData.name}</h1>
                {/* <Badge className={`${isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'} border-none px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                   {userData.status || "Inactive"}
                </Badge> */}
                {userData.email_verified_at && (
                  <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-bold text-[10px] rounded-lg px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </Badge>
                )}
             </div>
             
             <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-slate-500">
                <div className="flex items-center gap-2">
                   <span className="text-slate-400">User ID:</span> 
                   <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 select-all">{userData.user_id || "-"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Mail className="w-4 h-4 text-slate-400" /> 
                   {userData.email}
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                   <Calendar className="w-4 h-4 text-slate-400" /> 
                   Joined: {formatDate(userData.created_at)}
                </div>
                {/* <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div> */}
                <div className="flex items-center gap-1.5">
                   <Clock className="w-4 h-4 text-slate-400" /> 
                   Last Login: {formatDate(userData.updated_at, "MMM dd, yyyy hh:mm a")}
                </div>
             </div>
          </div>
       </div>
       
       {/* Right Side: Quick Actions */}
       <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto h-10 px-5 border-brand-blue/20 text-brand-blue hover:!bg-brand-blue hover:!border-brand-blue/40 hover:!text-white font-semibold rounded-xl shadow-sm gap-2 transition-all">
                 <Mail className="w-4 h-4" /> Send Email
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none">
              <NotificationDialogForm type="email" onClose={() => setEmailOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={pushOpen} onOpenChange={setPushOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto h-10 px-5 bg-brand-blue hover:bg-slate-50 border border-blue-50 hover:border hover:border-brand-blue hover:text-brand-blue text-white font-semibold rounded-xl shadow-sm gap-2 transition-all">
                 <Bell className="w-4 h-4" /> Push Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 border-none bg-transparent shadow-none">
              <NotificationDialogForm type="push" onClose={() => setPushOpen(false)} />
            </DialogContent>
          </Dialog>
       </div>
    </div>
  );
};

export default ProfileHeader;
