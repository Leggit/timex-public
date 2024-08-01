export default function holidayStatusCodeToActionText(code: string): any {
  switch (code) {
    case "NOT_SUBMITTED":
      return "Submit for authorisation";
    case "PENDING_AUTHORISATION":
      return "Cancel";
    case "AUTHORISED":
      return "Cancel";
    case "CANCELLED":
      return "Cancelled";
    case "TAKEN":
      return "Taken";
    default:
      return "Unkown!";
  }
}
