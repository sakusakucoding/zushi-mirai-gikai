import { EXTERNAL_LINKS } from "@/config/external-links";
import { routes } from "@/lib/routes";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterPolicyLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryLinks: FooterLink[] = [
  {
    label: "TOP",
    href: routes.home(),
  },
  {
    label: "逗子市議会（公式）",
    href: EXTERNAL_LINKS.COUNCIL_OFFICIAL,
    external: true,
  },
  {
    label: "本家「みらい議会」",
    href: EXTERNAL_LINKS.ORIGINAL_SERVICE,
    external: true,
  },
];

export const policyLinks: FooterPolicyLink[] = [
  {
    label: "よくあるご質問",
    href: EXTERNAL_LINKS.FAQ,
    external: true,
  },
  {
    label: "利用規約",
    href: routes.terms(),
  },
  {
    label: "プライバシーポリシー",
    href: routes.privacy(),
  },
  {
    label: "開発者向け",
    href: routes.developers(),
  },
  {
    label: "ソースコード",
    href: EXTERNAL_LINKS.GITHUB_REPO,
    external: true,
  },
];
