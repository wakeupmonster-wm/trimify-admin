import React from "react";
import {
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  ShieldOff,
  Bell,
  CreditCard,
  User,
  Smartphone,
  Ban,
} from "lucide-react";
import { Card, Pill, KV, EmptyState } from "./UserProfileView";

export function TabAccount({ data }) {
  const { user, handleCopy, initials, fmtDate, truncMid } = data;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <Card title="Account Status" subtitle="Current status and security details" >
            <KV
              icon={ShieldCheck}
              label="Status"
              value={
                <Pill
                  tone={
                    user.status === "Active" || user.status === "1"
                      ? "success"
                      : "neutral"
                  }
                >
                  {user.status === "1"
                    ? "Active"
                    : user.status === "0"
                      ? "Inactive"
                      : user.status}
                </Pill>
              }
            />
            <KV
              icon={ShieldOff}
              label="Admin Status"
              value={user.admin_status || "—"}
            />
            <KV
              icon={Mail}
              label="Email Verified"
              value={
                user.email_verified_at ? fmtDate(user.email_verified_at) : "No"
              }
            />
            <KV
              icon={Ban}
              label="Revoked"
              value={user.revoked_at ? fmtDate(user.revoked_at) : "No"}
            />
            <KV
              icon={Calendar}
              label="Created"
              value={fmtDate(user.created_at)}
            />
            <KV
              icon={Calendar}
              label="Updated"
              value={fmtDate(user.updated_at)}
            />
          </Card>

          <Card title="Billing" subtitle="Payment methods and history">
            <KV icon={CreditCard} label="Payment Status" value={user.paid ? "Paid" : "Unpaid"} />
            <KV icon={ShieldCheck} label="Plan" value={user.plan ? user.plan.title : "No active plan"} />
            <KV icon={Calendar} label="Plan Expiry" value={user.plan_expiry ? fmtDate(user.plan_expiry) : "—"} />
            <KV icon={CreditCard} label="Stripe ID" value={user.stripe_id || "Not linked"} />
            {(!user.transactions || user.transactions.length === 0) && (
              <EmptyState icon={CreditCard} title="No transactions yet" />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-3.5">
          <Card title="Device & Notifications" subtitle="App settings and preferences" >
            <KV icon={Bell} label="Notifications" value={user.notification_status ? "Enabled" : "Disabled"} />
            <KV icon={Globe} label="Timezone" value={user.timezone || "Not set"} />
            
            <div className="flex items-center justify-between gap-2.5 py-2">
              <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
                <Smartphone className="h-4 w-4" />
                Device Token
              </span>
              <button
                type="button"
                title={user.device_token}
                onClick={() => handleCopy(user.device_token, "Device token")}
                className="font-mono text-[10.5px] font-semibold text-slate-900 transition-colors hover:text-app-primary2"
              >
                {truncMid(user.device_token, 10, 6)}
              </button>
            </div>
          </Card>

          <Card title="Managed By" subtitle="Assigned sub-admin details"
            // right={
            //   <Pill
            //     tone={
            //       user.sub_admin?.status === "Active" ||
            //       user.sub_admin?.status === "1"
            //         ? "success"
            //         : "neutral"
            //     }
            //   >
            //     {user.sub_admin?.status === "1"
            //       ? "Active"
            //       : user.sub_admin?.status === "0"
            //         ? "Inactive"
            //         : user.sub_admin?.status}
            //   </Pill>
            // }
          >
            {user.sub_admin ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-semibold text-slate-500">
                    {initials(user.sub_admin?.name)}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-slate-900">
                      {user.sub_admin?.name}
                    </div>
                    <div className="text-[10.5px] font-medium text-slate-500">
                      {user.sub_admin?.designation} · {user.sub_admin?.hospital}
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <KV icon={Mail} label="Email" value={user.sub_admin?.email} />
                  <KV
                    icon={Phone}
                    label="Phone"
                    value={user.sub_admin?.phone}
                  />
                  <KV
                    icon={Globe}
                    label="Location"
                    value={user.sub_admin?.location}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                icon={User}
                title="No Sub-Admin Assigned"
                subtitle="This user is not managed by a specific sub-admin."
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
