-- みらい議会＠逗子市: status_order（並び順用の生成列）に「撤回」を追加する
-- 撤回された議案は並び順の最後尾（6）にする。
alter table public.bills
  alter column status_order set expression as (
    case status
      when 'enacted' then 0
      when 'rejected' then 1
      when 'in_receiving_house' then 2
      when 'in_originating_house' then 3
      when 'introduced' then 4
      when 'preparing' then 5
      when 'withdrawn' then 6
    end
  );
