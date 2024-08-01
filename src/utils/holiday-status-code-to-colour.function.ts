export default function holidayStatusCodeToColour(code: string): any {
  switch (code) {
    case "NOT_SUBMITTED":
      return "danger";
    case "PENDING_AUTHORISATION":
      return "warning";
    case "AUTHORISED":
      return "success";
    case "CANCELLED":
      return "info";
    case "TAKEN":
      return "secondary";
    default:
      return "Unkown!";
  }
}
