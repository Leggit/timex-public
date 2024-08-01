export interface IHoliday {
  id: number;
  status: string;
  authoriserId: number | null;
  authoriserFirstName: string | null;
  authoriserLastName: string | null;
  authorisingProjectCode: string | null;
  cancellationReason: string | null;
  timeEntries: {
    timeEntryId: number;
    numberOfHours: number;
    date: Date;
  }[];
}

export function deserialize(json: any[]) {
  const values = new Map<number, IHoliday>();

  json
    .map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
    }))
    .forEach((value) => {
      const holiday = values.get(value.id);
      if (holiday) {
        holiday.timeEntries.push({
          timeEntryId: value.timeEntryId,
          numberOfHours: value.numberOfHours,
          date: value.date,
        });
      } else {
        const newHoliday: IHoliday = {
          id: value.id,
          status: value.status,
          authoriserId: value.authoriserId,
          authoriserFirstName: value.authoriserFirstName,
          authoriserLastName: value.authoriserLastName,
          authorisingProjectCode: value.authorisingProjectCode,
          cancellationReason: value.cancellationReason,
          timeEntries: [
            {
              timeEntryId: value.timeEntryId,
              numberOfHours: value.numberOfHours,
              date: value.date,
            },
          ],
        };

        values.set(value.id, newHoliday);
      }
    });
  return Array.from(values.values());
}
