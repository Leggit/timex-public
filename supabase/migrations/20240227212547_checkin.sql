drop policy "ALLOW_ALL" on "public"."Holiday";

drop policy "ALLOW_ALL" on "public"."HolidayTimeEntry";

drop policy "ALLOW_ALL" on "public"."ResourceManager";

drop policy "Enable insert for authenticated users only" on "public"."TimeEntry";

drop policy "UserID matches" on "public"."TimeEntry";

drop policy "ALLOW_ALL" on "public"."TimeEntryType";

drop policy "Enable read access for all users" on "public"."Project";

create policy "allow_if_authenticated"
on "public"."Holiday"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "allow_if_authenticated"
on "public"."HolidayTimeEntry"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "allow_if_authenticated"
on "public"."ResourceManager"
as permissive
for select
to authenticated
using (true);


create policy "allow_if_authenticated"
on "public"."Task"
as permissive
for select
to authenticated
using (true);


create policy "allow_all_for_manager_of_project"
on "public"."TimeEntry"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT rm."userId"
   FROM "ResourceManager" rm
  WHERE (rm."projectCode" = rm."projectCode"))))
with check ((auth.uid() IN ( SELECT rm."userId"
   FROM "ResourceManager" rm
  WHERE (rm."projectCode" = rm."projectCode"))));


create policy "user_id_matches_current_user"
on "public"."TimeEntry"
as permissive
for all
to authenticated
using ((auth.uid() = "userId"))
with check ((auth.uid() = "userId"));


create policy "allow_if_authenticated"
on "public"."TimeEntryType"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."Project"
as permissive
for select
to authenticated
using (true);




