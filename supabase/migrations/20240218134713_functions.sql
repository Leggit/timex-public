alter table "public"."TimeEntry" drop constraint "TimeEntry_timeEntryType_fkey";

drop function if exists "public"."get_holidays_for_year"(user_id text, year bigint);

alter table "public"."Project" add column "displayColour" text;

alter table "public"."TimeEntry" drop column "timeEntryType";

alter table "public"."TimeEntry" add column "timeEntryTypeCode" character varying not null;

alter table "public"."TimeEntry" add constraint "TimeEntry_timeEntryTypeCode_fkey" FOREIGN KEY ("timeEntryTypeCode") REFERENCES "TimeEntryType"("timeEntryTypeCode") not valid;

alter table "public"."TimeEntry" validate constraint "TimeEntry_timeEntryTypeCode_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_count_of_holidays_not_submitted_for_user(user_id text)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
begin
  RETURN (SELECT COUNT(DISTINCT h.id) FROM "Holiday" h
  INNER JOIN "HolidayTimeEntry" hte
  	ON h.id = hte."holidayId"
  INNER JOIN "TimeEntry" t
    ON hte."timeEntryId" = t.id
  WHERE	t."userId"::TEXT = user_id AND h.status = 'NOT_SUBMITTED');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_time_entries_for_user(user_id text, min_date text, max_date text)
 RETURNS TABLE(id bigint, date date, "numberOfHours" numeric, probability bigint, "projectCode" text, "displayColour" text, "taskNumber" character varying, "timeEntryTypeCode" character varying, "timeEntryTypeDescription" character varying, "isOvertime" boolean, "holidayId" bigint, "holidayStatus" text, "isHoliday" boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query SELECT 
  	t.id,
	t.date,
	t."numberOfHours", 
	t.probability,
	t."projectCode",
	p."displayColour",
	t."taskNumber",
	t."timeEntryTypeCode",
	tet.description,
	tet."isOvertime",
	h.id,
	h.status,
	(SELECT h.id IS NOT NULL) AS "isHoliday"
  FROM "TimeEntry" t 
  INNER JOIN "Project" p
	ON p."projectCode" = t."projectCode"
  INNER JOIN "TimeEntryType" tet
  	ON tet."timeEntryTypeCode" = t."timeEntryTypeCode"
  LEFT JOIN "HolidayTimeEntry" hte
    ON hte."timeEntryId" = t.id
  LEFT JOIN "Holiday" h
  	ON h.id = hte."holidayId"
  WHERE t."userId"::TEXT = user_id 
  AND t.date >= min_date::DATE
  AND t.date <= max_date::DATE;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_holidays_for_year(user_id text, year bigint)
 RETURNS TABLE(id bigint, status text, "authoriserId" bigint, "authorisingProjectCode" text, "cancellationReason" text, "authoriserFirstName" text, "authoriserLastName" text, "timeEntryId" bigint, date date, "numberOfHours" numeric)
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

create policy "ALLOW_ALL"
on "public"."TimeEntryType"
as permissive
for all
to public
using (true)
with check (true);




