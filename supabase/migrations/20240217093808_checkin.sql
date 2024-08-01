drop trigger if exists "audit" on "public"."TimeEntry";

drop function if exists "public"."trigger_fn"();

alter table "public"."Holiday" add column "cancellationReason" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_holiday_trigger_fn()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	projectCode TEXT;
	holidayId BIGINT;
BEGIN
	SELECT new_table."projectCode" INTO projectCode FROM new_table LIMIT 1;
	IF (TG_OP = 'INSERT' AND projectCode = 'HOLIDAY') THEN
		INSERT INTO public."Holiday"(status) VALUES('NOT_SUBMITTED') RETURNING id INTO holidayId;
		INSERT INTO public."HolidayTimeEntry" SELECT holidayId, n."id" FROM new_table n;
	END IF;
	RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_holidays_for_year(user_id text, year bigint)
 RETURNS TABLE(id bigint, status text, authoriser bigint, authorisingprojectcode text, cancellationreason text, authoriserfirstname text, authoriserlastname text, timeentryid bigint, date date, numberofhours numeric)
 LANGUAGE plpgsql
AS $function$
begin
  return query SELECT h.*, rm."firstName", rm."lastName", t.id, t.date, t."numberOfHours" FROM "TimeEntry" t
	INNER JOIN "HolidayTimeEntry" hte
		ON hte."timeEntryId" = t.id
	INNER JOIN "Holiday" h
		ON h.id = hte."holidayId"
	LEFT JOIN resource_managers rm
		ON rm.id = h.authoriser
	WHERE t."userId"::text = user_id AND date_part('year', t.date) = year
	ORDER BY h.id, t.date;
end;
$function$
;
alter table "auth"."users" add column "firstName" text;
alter table "auth"."users" add column "lastName" text;
create or replace view "public"."resource_managers" as  SELECT rm.id,
    rm."projectCode",
    u."firstName",
    u."lastName"
   FROM ("ResourceManager" rm
     JOIN auth.users u ON ((rm."userId" = u.id)));


CREATE OR REPLACE FUNCTION public.get_recent_project_codes(user_id text)
 RETURNS TABLE(projectcode text)
 LANGUAGE plpgsql
AS $function$
begin
  return query select distinct "projectCode" from public."TimeEntry" where "userId"::text = user_Id;
end;
$function$
;

create policy "ALLOW_ALL"
on "public"."ResourceManager"
as permissive
for all
to public
using (true)
with check (true);


CREATE TRIGGER create_holiday_trigger AFTER INSERT ON public."TimeEntry" REFERENCING NEW TABLE AS new_table FOR EACH STATEMENT EXECUTE FUNCTION create_holiday_trigger_fn();


