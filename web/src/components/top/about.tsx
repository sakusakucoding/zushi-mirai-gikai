import Image from "next/image";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";
import { LinkButton } from "./link-button";

export function About() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-4">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2>
            <Image
              src="/icons/about-typography.svg"
              alt="About"
              width={143}
              height={36}
              priority
            />
          </h2>
          <p className="text-sm font-bold text-primary-accent">
            {SITE.NAME}とは
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold leading-[43.2px]">
              {SITE.COUNCIL_NAME}での議論を
              <br />
              できる限りわかりやすく
            </h3>
            <p className="text-[15px] leading-[28px] text-black">
              {SITE.NAME}は、{SITE.COUNCIL_NAME}
              で今どんな議案が検討されているか、わかりやすく伝えるプラットフォームです。市民の声をまちづくりに届けることを目指して、継続的にアップデートしていきます。
            </p>
          </div>

          <LinkButton
            href={EXTERNAL_LINKS.COUNCIL_OFFICIAL}
            icon={{
              src: "/icons/info-icon.svg",
              alt: "",
              width: 23,
              height: 22,
            }}
          >
            {SITE.COUNCIL_NAME}の公式ページへ
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
