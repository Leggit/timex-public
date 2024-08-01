export default function holidayStatusCodeToText(code: string): string {
  switch (code) {
    case "NOT_SUBMITTED":
      return "Not submitted";
    case "PENDING_AUTHORISATION":
      return "Pending authorisation";
    case "AUTHORISED":
      return "Authorised";
    case "CANCELLED":
      return "Cancelled";
    case "TAKEN":
      return "Taken";
    default:
      return "Unkown!";
  }
}
