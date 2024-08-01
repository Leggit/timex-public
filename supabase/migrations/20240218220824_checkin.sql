set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_projects(user_id text)
 RETURNS TABLE("projectCode" text, "startDate" date, "endDate" date, "displayColour" text, "recentlyUsed" boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query SELECT 
  p."projectCode", p."startDate", p."endDate", p."displayColour", 
  (SELECT (SELECT COUNT(*) FROM "TimeEntry" t WHERE t."projectCode" = p."projectCode" AND user_id = t."userId"::TEXT) > 0) AS "recentlyUsed"
  FROM "Project" p;
end;
$function$
;



