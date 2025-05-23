alter table "public"."test" drop constraint "test_pkey";

drop index if exists "public"."test_pkey";

drop table "public"."test";

create table "public"."Project" (
    "projectCode" text not null,
    "description" text,
    "endDate" date,
    "startDate" date,
    "requiresTask" boolean
);


alter table "public"."Project" enable row level security;

create table "public"."Task" (
    "taskNumber" character varying not null,
    "startDate" date,
    "endDate" date,
    "projectCode" text not null
);


alter table "public"."Task" enable row level security;

create table "public"."TimeEntry" (
    "id" bigint generated by default as identity not null,
    "userId" uuid not null,
    "timeEntryType" character varying not null,
    "date" date not null,
    "numberOfHours" bigint not null,
    "probability" bigint,
    "taskNumber" character varying not null,
    "projectCode" text
);


alter table "public"."TimeEntry" enable row level security;

create table "public"."TimeEntryType" (
    "timeEntryTypeCode" character varying not null,
    "description" character varying not null,
    "requiresApproval" boolean default false
);


alter table "public"."TimeEntryType" enable row level security;

CREATE UNIQUE INDEX "Project_pkey" ON public."Project" USING btree ("projectCode");

CREATE UNIQUE INDEX "Task_pkey" ON public."Task" USING btree ("taskNumber", "projectCode");

CREATE UNIQUE INDEX "TimeEntryType_pkey" ON public."TimeEntryType" USING btree ("timeEntryTypeCode");

CREATE UNIQUE INDEX "TimeEntry_pkey" ON public."TimeEntry" USING btree (id);

alter table "public"."Project" add constraint "Project_pkey" PRIMARY KEY using index "Project_pkey";

alter table "public"."Task" add constraint "Task_pkey" PRIMARY KEY using index "Task_pkey";

alter table "public"."TimeEntry" add constraint "TimeEntry_pkey" PRIMARY KEY using index "TimeEntry_pkey";

alter table "public"."TimeEntryType" add constraint "TimeEntryType_pkey" PRIMARY KEY using index "TimeEntryType_pkey";

alter table "public"."Task" add constraint "Task_projectCode_fkey" FOREIGN KEY ("projectCode") REFERENCES "Project"("projectCode") not valid;

alter table "public"."Task" validate constraint "Task_projectCode_fkey";

alter table "public"."TimeEntry" add constraint "TimeEntry_projectCode_fkey" FOREIGN KEY ("projectCode") REFERENCES "Project"("projectCode") not valid;

alter table "public"."TimeEntry" validate constraint "TimeEntry_projectCode_fkey";

alter table "public"."TimeEntry" add constraint "TimeEntry_timeEntryType_fkey" FOREIGN KEY ("timeEntryType") REFERENCES "TimeEntryType"("timeEntryTypeCode") not valid;

alter table "public"."TimeEntry" validate constraint "TimeEntry_timeEntryType_fkey";

alter table "public"."TimeEntry" add constraint "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) not valid;

alter table "public"."TimeEntry" validate constraint "TimeEntry_userId_fkey";

create policy "Enable insert for authenticated users only"
on "public"."TimeEntry"
as permissive
for insert
to authenticated
with check (true);



