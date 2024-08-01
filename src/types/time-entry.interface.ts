export interface ITimeEntry {
  id?: any;
  date: Date;
  userId: string;
  numberOfHours: number;
  probability?: number | null;
  projectCode: string;
  taskNumber: string | null;
  timeEntryTypeCode: string;
  displayColour?: string;
  holidayId?: number | null;
  holidayStatus?: string | null;
  isHoliday?: boolean;
  isOvertime?: boolean;
  timeEntryTypeDescription?: string;
}

export function deserialize(...timeEntry: any): ITimeEntry[] {
  return timeEntry.map((entry: any) => ({
    ...entry,
    date: new Date(entry.date),
  }));
}
