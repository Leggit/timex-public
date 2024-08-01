import { Info, Warning } from "@mui/icons-material";
import { supabase } from "./supabase";

export async function cancelHoliday(
  holidayId: any,
  successCallback: () => any,
) {
  const { error } = await supabase
    .from("Holiday")
    .update({
      status: "CANCELLED",
      cancellationReason: "Cancelled by employee",
    })
    .eq("id", holidayId);

  if (error) {
    console.log(error);
    return {
      message: "Failed to cancel holiday",
      color: "danger",
      icon: <Warning />,
    };
  } else {
    successCallback();
    return {
      message: "Holiday cancelled",
      color: "neutral",
      icon: <Info />,
    };
  }
}
