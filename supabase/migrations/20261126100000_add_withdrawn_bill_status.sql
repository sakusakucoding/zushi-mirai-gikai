-- みらい議会＠逗子市: 議案の「撤回」ステータスを追加する
-- 市議会では提出者が議案を撤回し、議会がこれを承認することがある（採決は行われない）。
-- 否決とも審議中とも異なるため、専用のステータスとして持つ。
-- enum への値追加は同じトランザクション内で使えないため、status_order の更新は次のマイグレーションで行う。
alter type public.bill_status_enum add value if not exists 'withdrawn';
