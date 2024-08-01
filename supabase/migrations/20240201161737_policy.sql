create policy "Enable read access for all users"
on "public"."Project"
as permissive
for select
to public
using (true);




