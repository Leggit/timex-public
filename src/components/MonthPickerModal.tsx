import Sheet from "@mui/joy/Sheet";
import { Box, Button, Divider, Grid, Modal } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { EditCalendar } from "@mui/icons-material";

const MonthPickerModal = ({
  currentMonth,
  currentYear,
  open,
  close,
}: {
  currentMonth: number;
  currentYear: number;
  open: boolean;
  close: (_: { selectedYear: number; selectedMonth: number }) => void;
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [showYears, setShowYears] = useState(false);
  const [years] = useState(
    new Array(2100 - 1900).fill(null).map((_, index) => 1900 + index),
  );
  const selectedYearRef = useRef<any>();

  useEffect(() => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  }, [currentYear, currentMonth]);

  const doneHandler = () => {
    if (showYears) {
      setShowYears(false);
    } else {
      close({ selectedYear, selectedMonth });
    }
  };

  const grid = (
    data: any[],
    selectedIndex: number,
    clickHandler: (item: any, index: number) => void,
  ) => {
    return data.map((item, index) => (
      <Grid xs={1} key={index}>
        <Button
          onClick={() => clickHandler(item, index)}
          sx={{ display: "block", width: "100%" }}
          variant={index === selectedIndex ? "soft" : "plain"}
          ref={index === selectedIndex ? selectedYearRef : null}
          color={index === selectedIndex ? "primary" : "neutral"}>
          {item}
        </Button>
      </Grid>
    ));
  };

  useEffect(() => {
    if (showYears) {
      selectedYearRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [showYears]);

  return (
    <Modal
      open={open}
      onClose={() => close({ selectedYear, selectedMonth })}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "8px",
          }}>
          {!showYears && (
            <Button
              sx={{ width: "100%" }}
              onClick={() => setShowYears(true)}
              endDecorator={<EditCalendar />}
              color="neutral"
              variant="outlined">
              {selectedYear}
            </Button>
          )}
          {showYears && (
            <Button variant="plain" disabled>
              Select a year
            </Button>
          )}
        </Box>
        <Grid
          container
          spacing={0}
          rowSpacing={0.75}
          columnSpacing={{ xs: 1 }}
          columns={{ xs: 3 }}
          sx={{
            width: "350px",
            marginBottom: "8px",
            height: "168px",
            overflowY: "auto",
          }}>
          {!showYears &&
            grid(months, selectedMonth, (_, index) => setSelectedMonth(index))}
          {showYears &&
            grid(years, years.indexOf(selectedYear), (item) =>
              setSelectedYear(item),
            )}
        </Grid>
        <Divider sx={{ mb: 1 }} />
        <Box
          sx={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
          <Button sx={{ width: "100%" }} onClick={() => doneHandler()}>
            {showYears
              ? "Select " + selectedYear
              : "View " + months[selectedMonth] + " " + selectedYear}
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default MonthPickerModal;
