set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_recent_project_codes(user_id text)
 RETURNS TABLE(projectcode text)
 LANGUAGE plpgsql
AS $function$
begin
  return query select distinct "projectCode" from public."TimeEntry" where "user_id" = user_Id;
end;
$function$
;



