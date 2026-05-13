import type { LucideIcon } from 'lucide-react';

interface InfoFeature {
  icon: LucideIcon;
  text: string;
}

interface SidebarInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: InfoFeature[];
  horizontal?: boolean;
}

export const SidebarInfoCard = ({
  icon: TitleIcon,
  title,
  description,
  features,
  horizontal = false,
}: SidebarInfoCardProps) => {
  if (horizontal) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <TitleIcon className="size-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed flex-1">{description}</p>
        <ul className="flex items-center gap-5 shrink-0">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5 text-xs text-amber-700">
              <Icon className="size-3.5 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TitleIcon className="size-4 text-amber-600" />
        <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <p className="text-xs text-amber-700 mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2 text-xs text-amber-700">
            <Icon className="size-3.5 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};