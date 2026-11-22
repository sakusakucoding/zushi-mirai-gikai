import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";
import { LinkButton } from "./link-button";

/**
 * 本家「みらい議会」との関係を示すセクション。
 * Fork ガイドラインの免責文言・本家リンク・ソースコード公開先をまとめて表示する。
 */
export function OriginalProject() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-[22px] font-bold">このサービスについて</h2>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-[28px] text-black font-bold">
            {SITE.DISCLAIMER}
          </p>
          <p className="text-[15px] leading-[28px] text-black">
            {SITE.NAME}
            は、オープンソースで公開されている「みらい議会」のソースコードをもとに、
            {SITE.COUNCIL_NAME}向けに改変して運営しています。運営：
            {SITE.OPERATOR_NAME}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <LinkButton
            href={EXTERNAL_LINKS.ORIGINAL_SERVICE}
            icon={{
              src: "/icons/info-icon.svg",
              alt: "",
              width: 23,
              height: 22,
            }}
          >
            本家「みらい議会」を見る
          </LinkButton>
          <LinkButton
            href={EXTERNAL_LINKS.GITHUB_REPO}
            icon={{
              src: "/icons/sns/icon_web.svg",
              alt: "",
              width: 22,
              height: 22,
            }}
          >
            このサービスのソースコード
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
