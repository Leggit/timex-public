set check_function_bodies = off;

create or replace view "public"."next_test_user" as  SELECT u.email AS user_id
   FROM auth.users u
  WHERE ((( SELECT count(*) AS count
           FROM "TimeEntry" te
          WHERE (te."userId" = u.id)) = 0) AND (( SELECT count(*) AS count
           FROM auth.sessions
          WHERE (sessions.user_id = u.id)) = 0) AND ((u.email)::text !~~ '%@%'::text))
  ORDER BY (random())
 LIMIT 1;


CREATE OR REPLACE FUNCTION public.update_test_users()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE 
  row auth.users%rowtype;
BEGIN
FOR row IN (SELECT * FROM auth.users WHERE created_at > CURRENT_DATE) LOOP
   UPDATE auth.users SET email = (SELECT floor(random() * 1000000 + 1)::TEXT) WHERE id = row.id;
   END LOOP;
END;
$function$
;



