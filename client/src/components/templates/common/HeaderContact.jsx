import React from "react";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";
import { normalizeLinkedin, displayUrl } from "../../../utils/personal";

const HeaderContact = ({ personal = {}, className = "text-sm" }) => {
  const email = personal?.email;
  const phone = personal?.phone || personal?.phone_number;
  const linkedinUrl = normalizeLinkedin(personal?.linkedin);
  const linkedinText = displayUrl(linkedinUrl);
  const website = personal?.website;
  const safeWebsite = website && /^https?:/i.test(String(website)) && !String(website).startsWith('blob:') ? String(website) : null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-start gap-4">
        {email && (
          <a className="inline-flex items-center gap-2 hover:underline" href={`mailto:${email}`}>
            <Mail className="size-4" />
            <span className="break-all">{email}</span>
          </a>
        )}
        {phone && (
          <a className="inline-flex items-center gap-2 hover:underline" href={`tel:${phone}`}>
            <Phone className="size-4" />
            <span>{phone}</span>
          </a>
        )}
        <a target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 break-all hover:underline" href={linkedinUrl}>
          <Linkedin className="size-4" />
          <span>{linkedinText}</span>
        </a>
        {safeWebsite && (
          <a target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 break-all hover:underline" href={safeWebsite}>
            <Globe className="size-4" />
            <span>{displayUrl(safeWebsite)}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default HeaderContact;
