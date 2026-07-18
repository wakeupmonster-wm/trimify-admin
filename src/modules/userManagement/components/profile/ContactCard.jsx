import React from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { SectionCard, ListItem } from "./SharedComponents";

const ContactCard = ({ userData }) => {
  return (
    <SectionCard title="Contact Info" subheading="Communication and location details" icon={MapPin}>
       <div className="flex flex-col">
          <ListItem 
             icon={Mail} 
             label="Email Address" 
             value={userData.email} 
          />
          <ListItem 
             icon={Phone} 
             label="Phone Number" 
             value={userData.mobileNo} 
          />
          <ListItem 
             icon={MapPin} 
             label="Location" 
             value={userData.sub_admin?.location || "Australia"} 
          />
          <ListItem 
             icon={Clock} 
             label="Timezone" 
             value={userData.timezone || "Australia/Sydney (GMT+10)"} 
          />
       </div>
    </SectionCard>
  );
};

export default ContactCard;
