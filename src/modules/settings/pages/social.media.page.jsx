import React, { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { SocialInput } from "../components/SocialInput";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSocialMediaStatus,
  fetchSocialMedia,
  updateSocialMediaAction,
} from "../store/social.media.slice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuFacebook, LuInstagram, LuTwitter, LuYoutube } from "react-icons/lu";
import { PiTiktokLogo } from "react-icons/pi";
import { LiaTelegramPlane } from "react-icons/lia";

const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook Profile/Page",
    title: "Facebook",
    icon: <LuFacebook size={22} />,
    iconKey: "facebook",
    placeholder: "https://facebook.com/yourpage",
    order: 1,
  },
  instagram: {
    label: "Instagram Handle",
    title: "Instagram",
    icon: <LuInstagram size={22} />,
    iconKey: "instagram",
    placeholder: "https://instagram.com/yourprofile",
    order: 2,
  },
  twitter: {
    label: "X (Twitter) Profile",
    title: "X (Twitter)",
    icon: <LuTwitter size={22} />,
    iconKey: "twitter",
    placeholder: "https://twitter.com/yourhandle",
    order: 3,
  },
  tiktok: {
    label: "TikTok Profile",
    title: "TikTok",
    icon: <PiTiktokLogo size={22} />,
    iconKey: "tiktok",
    placeholder: "https://tiktok.com/@yourprofile",
    order: 4,
  },
  youtube: {
    label: "YouTube Channel",
    title: "YouTube",
    icon: <LuYoutube size={22} />,
    iconKey: "youtube",
    placeholder: "https://youtube.com/c/yourchannel",
    order: 5,
  },
  telegram: {
    label: "Telegram Group/Channel",
    title: "Telegram",
    icon: <LiaTelegramPlane size={22} />,
    iconKey: "telegram",
    placeholder: "https://t.me/yourgroup",
    order: 6,
  },
};

export default function SocialMediaPage() {
  const dispatch = useDispatch();
  const { list, loading, error, successMessage } = useSelector(
    (state) => state.socialMedia,
  );

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
    telegram: "",
    tiktok: "",
  });

  // Sync Logic
  useEffect(() => {
    if (list?.socialMedia && Array.isArray(list.socialMedia)) {
      const updatedLinks = {};
      list.socialMedia.forEach((item) => {
        if (item.platform) {
          updatedLinks[item.platform] = item.url || "";
        }
      });
      setSocialLinks((prev) => ({ ...prev, ...updatedLinks }));
    }
  }, [list]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(fetchSocialMedia());
      dispatch(clearSocialMediaStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearSocialMediaStatus());
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const payload = Object.keys(PLATFORM_CONFIG).map((key) => {
      const config = PLATFORM_CONFIG[key];
      return {
        platform: key,
        title: config.title,
        url: socialLinks[key] || "",
        icon: config.iconKey,
        isActive: true,
        order: config.order,
      };
    });

    dispatch(updateSocialMediaAction(payload));
  };

  const handleDiscard = () => {
    if (list?.socialMedia && Array.isArray(list.socialMedia)) {
      const originalLinks = {};
      list.socialMedia.forEach((item) => {
        if (item.platform) {
          originalLinks[item.platform] = item.url || "";
        }
      });
      setSocialLinks(originalLinks);
    }
  };

  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  return (
    <div className="w-full">
      <header className="px-2 mb-4 border-b border-slate-300/60 pb-4">
        <h1 className="text-lg font-bold text-foreground/90">
          Social Media Links
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Manage the social media links displayed across the application and
          emails.
        </p>
      </header>

      <div className="space-y-8 px-2 pb-4">
        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
          <SocialInput
            key={key}
            label={config.label}
            name={key}
            value={socialLinks[key] || ""}
            onChange={handleInputChange}
            placeholder={config.placeholder}
            icon={config.icon}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-5">
        <Button
          type="button"
          variant="outline"
          className="h-10 px-6 border-slate-300/60 text-muted-foreground/70 font-semibold text-[13px] capitalize rounded-md hover:bg-slate-50"
          onClick={handleDiscard}
        >
          Discard Changes
        </Button>
        <Button
          type="button"
          disabled={loading}
          className="h-10 px-6 bg-app-primary2 hover:bg-brand-hoverAqua text-white font-semibold text-[13px] capitalize rounded-md shadow-sm"
          onClick={handleSave}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
