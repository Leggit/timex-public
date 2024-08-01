alter table "public"."HolidayTimeEntry" drop constraint "HolidayTimeEntry_timeEntryId_fkey";

alter table "public"."HolidayTimeEntry" add constraint "HolidayTimeEntry_timeEntryId_fkey" FOREIGN KEY ("timeEntryId") REFERENCES "TimeEntry"(id) ON DELETE CASCADE not valid;

alter table "public"."HolidayTimeEntry" validate constraint "HolidayTimeEntry_timeEntryId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_holiday_time_entry_trigger_fn()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	timeEntryCount INT;
BEGIN
	SELECT count(*) INTO timeEntryCount FROM public."HolidayTimeEntry" WHERE "HolidayTimeEntry"."holidayId" = OLD."holidayId";
	IF(timeEntryCount = 0) THEN
		DELETE FROM public."Holiday" WHERE "Holiday".id = OLD."holidayId";
	END IF;
	RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_fn()
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

create policy "ALLOW_ALL"
on "public"."Holiday"
as permissive
for all
to public
using (true)
with check (true);


create policy "ALLOW_ALL"
on "public"."HolidayTimeEntry"
as permissive
for all
to public
using (true)
with check (true);


CREATE TRIGGER delete_empty_holiday_trigger AFTER DELETE ON public."HolidayTimeEntry" FOR EACH ROW EXECUTE FUNCTION delete_holiday_time_entry_trigger_fn();

CREATE TRIGGER audit AFTER INSERT ON public."TimeEntry" REFERENCING NEW TABLE AS new_table FOR EACH STATEMENT EXECUTE FUNCTION trigger_fn();



