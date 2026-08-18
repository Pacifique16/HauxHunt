import Image from "next/image";

import type { DemoTenant } from "@/components/renter/use-tenant-plan";

function getInitials(name: string) {
  const names = name.trim().split(/\s+/).filter(Boolean);
  if (!names.length) return "?";
  return `${names[0][0]}${names.length > 1 ? names.at(-1)?.[0] : ""}`.toUpperCase();
}

/** Renders a tenant's photo, or an initials avatar for personas without one. */
export function TenantAvatar({
  tenant,
  className = "size-10",
  ringClassName = "ring-black/10",
}: {
  tenant: DemoTenant;
  className?: string;
  ringClassName?: string;
}) {
  if (tenant.avatar) {
    return (
      <Image
        src={tenant.avatar}
        alt={tenant.name}
        className={`${className} rounded-full object-cover ring-2 ${ringClassName}`}
      />
    );
  }

  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-[#292929] ring-2 ${ringClassName}`}
    >
      <span className="font-bricolage text-xs font-medium text-white/90">
        {getInitials(tenant.name)}
      </span>
      <span className="sr-only">{tenant.name}</span>
    </span>
  );
}
