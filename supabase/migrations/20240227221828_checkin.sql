drop function if exists "public"."get_time_entries_for_user"(user_id text, min_date text, max_date text);

alter table "public"."Task" alter column "taskNumber" set data type text using "taskNumber"::text;

alter table "public"."TimeEntry" alter column "taskNumber" drop not null;

alter table "public"."TimeEntry" alter column "taskNumber" set data type text using "taskNumber"::text;

alter table "public"."TimeEntry" alter column "timeEntryTypeCode" set data type text using "timeEntryTypeCode"::text;

alter table "public"."TimeEntryType" alter column "description" set data type text using "description"::text;

alter table "public"."TimeEntryType" alter column "timeEntryTypeCode" set data type text using "timeEntryTypeCode"::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_time_entries_for_user(user_id text, min_date text, max_date text)
 RETURNS TABLE(id bigint, date date, "numberOfHours" numeric, probability bigint, "projectCode" text, "displayColour" text, "taskNumber" text, "timeEntryTypeCode" text, "timeEntryTypeDescription" text, "isOvertime" boolean, "holidayId" bigint, "holidayStatus" text, "isHoliday" boolean)
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



