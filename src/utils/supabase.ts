import { IProject } from "../types/project.interface";
import { IResourceManager } from "../types/resource-manager.interface";
import { ITimeEntry } from "../types/time-entry.interface";

/**
 * Please ignore this mess - it is something I hastily made in a few hours to allow the app to be demoed without being connected to a supabase instance
 */
class MockSupabase {
  user: any;
  onAuthChange: any;

  auth = {
    signInWithPassword: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      this.user = { id: email };
      this.onAuthChange(null, { user: this.user });
      return Promise.resolve({ error: null as any });
    },
    getSession: () => ({
      data: { session: this.user },
      error: null,
    }),
    onAuthStateChange: (arg: any) => {
      this.onAuthChange = arg;
      return {
        data: { subscription: { unsubscribe: () => {} } },
      };
    },
    signOut: () => {
      this.onAuthChange();
      this.user = null;
    },
  };

  from(place: string): {
    select?: any;
    update?: any;
    delete?: any;
    upsert?: any;
  } {
    switch (place) {
      case "next_test_user":
        return {
          select: (...args: any) => ({
            data: [{ user_id: "123456" }],
            error: null as any,
          }),
        };
      case "resource_managers":
        return {
          select: (...args: any) =>
            this.returnWithDelay({
              data: this.mockData.resourceManagers,
              error: null as any,
            }),
        };
      case "Holiday":
        return {
          update: (args: any) => {
            return {
              eq: (_: any, id: string) => this.updateHoliday(args, id),
            };
          },
        };
      case "TimeEntry":
        return {
          delete: () => ({
            in: (_: string, values: string[]) => this.deleteTimeEntries(values),
          }),
          update: (timeEntry: any) => ({
            eq: (_: any, id: string) => this.updateTimeEntry(id, timeEntry),
          }),
          upsert: (timeEntries: any[]) => ({
            select: () => this.upsertTimeEntries(timeEntries),
          }),
        };
      case "Task":
        return {
          select: () => ({
            eq: (_: any, projectCode: string) =>
              this.getTaskNumbersForProjectCode(projectCode),
          }),
        };
      case "TimeEntryType":
        return {
          select: () => this.getTimeEntryTypes(),
        };
      default:
        throw new Error("Not defined");
    }
  }

  rpc(name: string, args: any): Promise<{ data: any; error: any }> {
    switch (name) {
      case "get_holidays_for_year":
        return this.getHolidaysForYear(args);
      case "get_count_of_holidays_not_submitted_for_user":
        return this.getCountOfHolidaysNotSubmittedForUser(args);
      case "get_time_entries_for_user":
        return this.getTimeEntriesForUser(args);
      case "get_projects":
        return this.getProjects();
      default:
        throw new Error("Not defined");
    }
  }

  private async getHolidaysForYear({ user_id, year }: any) {
    const holidayIds = this.mockData.holidays
      .filter((holiday) => holiday.year === year)
      .map((h) => h.id);
    const holidayTimeEntries = this.mockData.holidayTimeEntries.filter((item) =>
      holidayIds.includes(item.holidayId),
    );
    const joinedData = holidayTimeEntries.map((hte) => {
      const holiday = this.mockData.holidays.find(
        (h) => h.id === hte.holidayId,
      )!;
      const timeEntry = this.mockData.timeEntries.find(
        (item) => item.id === hte.timeEntryId,
      )!;
      const rm = this.mockData.resourceManagers.find(
        (rm) => String(rm.id) === String(holiday?.authoriser),
      );
      return {
        id: holiday.id,
        status: holiday.status,
        authoriser: rm?.id,
        authorisingProjectCode: rm?.projectCode,
        authoriserFirstName: rm?.firstName,
        authoriserLastName: rm?.lastName,
        timeEntryId: timeEntry.id,
        date: timeEntry.date,
        numberOfHours: timeEntry.numberOfHours,
        cancelationReason: holiday.cancellationReason,
      };
    });
    return this.returnWithDelay({
      data: joinedData,
      error: null as any,
    });
  }

  private async getCountOfHolidaysNotSubmittedForUser({ user_id }: any) {
    return this.returnWithDelay({
      data: this.mockData.holidays.filter(
        (holiday) => holiday.status === "NOT_SUBMITTED",
      ).length,
      error: null as any,
    });
  }

  private async getTimeEntriesForUser({ min_date, max_date }: any) {
    console.log("Fetching time for dates " + min_date + " to " + max_date);
    const timeEntries = this.mockData.timeEntries.filter(
      (entry) =>
        new Date(entry.date).getTime() >= new Date(min_date).getTime() &&
        new Date(entry.date).getTime() <= new Date(max_date).getTime(),
    );
    timeEntries.forEach((timeEntry) => {
      const hte = this.mockData.holidayTimeEntries.find(
        (item) => item.timeEntryId === timeEntry.id,
      );
      if (hte) {
        const holiday = this.mockData.holidays.find(
          (item) => item.id === hte.holidayId,
        );
        timeEntry.holidayId = hte.holidayId;
        timeEntry.holidayStatus = holiday?.status;
        timeEntry.isHoliday = !!holiday;
      }
      const project = this.mockData.projects.find(
        (p) => p.projectCode === timeEntry.projectCode,
      );
      timeEntry.displayColour = project?.displayColour;
    });
    return this.returnWithDelay({
      data: timeEntries,
      error: null as any,
    });
  }

  private async updateHoliday(
    args: {
      status: string;
      cancellationReason: string;
      authoriser: string;
      authorisingProjectCode: string;
    },
    id: string,
  ) {
    const hol = this.mockData.holidays.find((holiday) => holiday.id === id);
    if (hol) {
      Object.assign(hol, args);
    }
    return this.returnWithDelay({ error: null as any });
  }

  private async deleteTimeEntries(ids: string[]) {
    this.mockData.timeEntries = this.mockData.timeEntries.filter(
      (timeEntry) => !ids.includes(timeEntry.id),
    );
    return this.returnWithDelay({ error: null as any });
  }

  private async getTaskNumbersForProjectCode(projectCode: string) {
    return this.returnWithDelay({
      data: this.tasks.filter((task) => task.projectCode === projectCode),
      error: null as any,
    });
  }

  private async updateTimeEntry(id: string, timeEntry: any) {
    const existingTimeEntry = this.mockData.timeEntries.find(
      (item) => item.id === id,
    );
    if (existingTimeEntry) {
      Object.assign(existingTimeEntry, timeEntry);
    }
    return this.returnWithDelay({ data: null as any, error: null as any });
  }

  private async getTimeEntryTypes() {
    return {
      data: [
        {
          timeEntryTypeCode: "STANDARD",
          description: "Standard",
        },
        {
          timeEntryTypeCode: "FORECAST",
          description: "Forecast",
        },
      ],
      error: null as any,
    };
  }

  private getId() {
    return String(Math.round(Math.random() * 100000));
  }

  private async upsertTimeEntries(timeEntries: ITimeEntry[]) {
    timeEntries.forEach((entry, index) => (entry.id = this.getId()));
    this.mockData.timeEntries.push(...timeEntries);

    if (timeEntries[0].projectCode === "HOLIDAY") {
      const holId = this.getId();
      this.mockData.holidays.push({
        id: holId,
        year: new Date(timeEntries[0].date).getFullYear(),
        status: "NOT_SUBMITTED",
      });

      this.mockData.holidayTimeEntries.push(
        ...timeEntries.map((timeEntry) => ({
          holidayId: holId,
          timeEntryId: timeEntry.id,
        })),
      );
    }

    return this.returnWithDelay({
      data: timeEntries,
      error: null as any,
    });
  }

  private async getProjects() {
    return this.returnWithDelay({
      data: this.mockData.projects,
      error: null as any,
    });
  }

  private returnWithDelay<T>(data: T, delay: number = 250): Promise<T> {
    return new Promise((res) => setTimeout(() => res(data), delay));
  }

  private readonly projects: IProject[] = [
    { projectCode: "999888", recentlyUsed: true },

    {
      projectCode: "123456",
      displayColour: "rgb(246, 191, 38)",
      recentlyUsed: true,
    },
    {
      projectCode: "HOLIDAY",
      displayColour: "rgb(142, 36, 170)",
      recentlyUsed: true,
    },
    {
      projectCode: "123123",
      displayColour: "rgb(11, 128, 67)",
      recentlyUsed: true,
    },
  ];

  private readonly tasks = [
    { taskNumber: "1", projectCode: "HOLIDAY" },
    { taskNumber: "1", projectCode: "123456" },
    { taskNumber: "1", projectCode: "123123" },
    { taskNumber: "1", projectCode: "999888" },
    { taskNumber: "ANYTIME", projectCode: "123456" },
    { taskNumber: "TIME", projectCode: "123456" },
    { taskNumber: "MGMT", projectCode: "123456" },
    { taskNumber: "PRO", projectCode: "123123" },
  ];

  private mockData: {
    holidayTimeEntries: any[];
    projects: IProject[];
    holidays: {
      year: number;
      id: any;
      status: string;
      authoriser?: string;
      authorisingProjectCode?: string;
      cancellationReason?: string;
    }[];
    resourceManagers: IResourceManager[];
    timeEntries: ITimeEntry[];
  } = {
    projects: this.projects,
    holidays: [],
    resourceManagers: [
      {
        id: 123,
        firstName: "Jim",
        lastName: "The authoriser",
        projectCode: "123456",
      },
    ],
    timeEntries: [],
    holidayTimeEntries: [],
  };
}
const supabase = new MockSupabase();

(window as any)["mockSupabase"] = supabase;

export { supabase };
