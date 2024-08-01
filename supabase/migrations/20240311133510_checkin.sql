set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.wipe_ip()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	new.ip = NULL;
	RETURN NEW;
END;
$function$
;

create or replace trigger wipe_ip_trigger 
before insert or update on auth.sessions for each row
execute function wipe_ip ();