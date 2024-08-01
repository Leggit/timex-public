import {
  Badge,
  Box,
  IconButton,
  LinearProgress,
  Link,
  Typography,
} from "@mui/joy";
import { Close, TimelapseOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { ITimeEntry } from "../types/time-entry.interface";
import TimeEntry from "./TimeEntry";
import { format } from "date-fns";

interface DayProps {
  timeEntries: ITimeEntry[];
  date: Date;
  isWeekend: boolean;
  disabled?: boolean;
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showIncompleteDays: boolean;
  selectTimeEntry: (timeEntry: ITimeEntry) => void;
  expand?: boolean;
  collapse?: () => void;
  selectionMode: boolean;
  selectedTimeEntries: ITimeEntry[];
  showProgressBar: boolean;
}

export default function Day(props: DayProps) {
  const ref = useRef<any>();
  const [showExpanded, setShowExpanded] = useState(false);
  const [maxEntries, setMaxEntries] = useState(40);

  useEffect(() => {
    if (props.expand) {
      const clickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          props.collapse?.();
        }
      };
      document.addEventListener("mousedown", clickOutside);

      return () => document.removeEventListener("mousdown", clickOutside);
    }
  }, [ref]);

  useEffect(() => {
    if (ref && window.innerWidth > 768) {
      setMaxEntries(Math.floor((ref.current.clientHeight - 24 - 32) / 21));
    }
  }, [ref]);

  const createBorderRadiusValue = (props: DayProps) => {
    switch (props.corner) {
      case "top-left":
        return "5px 0px 0px 0px";
      case "bottom-left":
        return "0px 0px 0px 5px";
      case "top-right":
        return "0px 5px 0px 0px";
      case "bottom-right":
        return "0px 0px 5px 0px";
      default:
        return 0;
    }
  };

  const getBackgroundColor = (props: DayProps) => {
    if (props.disabled) {
      return "neutral.plainDisabledColor";
    }
    if (props.isWeekend) {
      return "neutral.300";
    }
    return "";
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        flexGrow: 1,
        padding: "2px",
        height: { xs: "auto", sm: "100%" },
        minHeight: { xs: "100px", sm: "auto" },
        border: 1,
        borderRadius: { xs: 0, sm: createBorderRadiusValue(props) },
        borderColor: "rgb(237, 239, 241)",
        backgroundColor: getBackgroundColor(props),
      }}>
      <Badge
        invisible={
          !props.showIncompleteDays ||
          props.disabled ||
          props.isWeekend ||
          props.timeEntries.reduce((acc, cur) => acc + cur.numberOfHours, 0) >=
            7.5
        }
        badgeContent={<TimelapseOutlined />}
        variant="soft"
        size="sm"
        color="warning"
        badgeInset="10px 16px"
        sx={{ display: "block" }}>
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ display: { xs: "inline", sm: "none" }, mr: 1 }}>
            {format(props.date, "EEE")}
          </Typography>
          {format(props.date, "d")}
        </Box>
      </Badge>
      {props.expand && (
        <Box
          sx={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}>
          <IconButton
            size="sm"
            onClick={() => props.collapse?.()}
            color="neutral"
            variant="plain">
            <Close />
          </IconButton>
        </Box>
      )}

      {props.showProgressBar && (
        <LinearProgress
          variant="soft"
          size="sm"
          color="neutral"
          sx={{ opacity: 0.15 }}
        />
      )}

      {!props.showProgressBar &&
        props.timeEntries
          .slice(0, props.expand ? undefined : maxEntries)
          .map((entry, index) => (
            <TimeEntry
              selected={props.selectedTimeEntries.includes(entry)}
              selectionMode={props.selectionMode}
              onClick={() => !props.disabled && props.selectTimeEntry(entry)}
              key={index}
              disabled={props.disabled}
              timeEntry={entry}
            />
          ))}
      {props.timeEntries.length > maxEntries && !props.expand && (
        <Box sx={{ pb: 1, display: { xs: "none", sm: "inherit" } }}>
          <Link onClick={() => setShowExpanded(true)} level="body-xs">
            +{props.timeEntries.length - maxEntries} More
          </Link>
        </Box>
      )}

      {showExpanded && (
        <Box
          sx={{
            boxShadow: "lg",
            width: ref.current.clientWidth + 30,
            minHeight: ref.current.clientHeight + 20,
            backgroundColor: "white",
            zIndex: 999,
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            top: 0,
            left: 0,
          }}>
          <Day
            collapse={() => setShowExpanded(false)}
            {...props}
            expand={true}
          />
        </Box>
      )}
    </Box>
  );
}
