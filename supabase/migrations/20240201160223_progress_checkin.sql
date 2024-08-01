alter table "public"."TimeEntry" alter column "numberOfHours" set data type numeric using "numberOfHours"::numeric;

create policy "UserID matches"
on "public"."TimeEntry"
as permissive
for all
to public
using ((auth.uid() = "userId"))
with check ((auth.uid() = "userId"));




