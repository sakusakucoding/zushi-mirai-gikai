"use client";

import { SITE } from "@/config/site";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { ChatButton } from "./chat-button";

interface HomeChatClientProps {
  currentDifficulty: DifficultyLevelEnum;
  bills: Array<{
    name: string;
    summary?: string;
    tags?: string[];
    isFeatured?: boolean;
  }>;
}

/**
 * トップページ用のチャット機能を提供するコンポーネント
 */
export function HomeChatClient({
  currentDifficulty,
  bills,
}: HomeChatClientProps) {
  if (!SITE.FEATURES.AI_CHAT) return null;

  return (
    <ChatButton
      difficultyLevel={currentDifficulty}
      pageContext={{
        type: "home",
        bills,
      }}
    />
  );
}
