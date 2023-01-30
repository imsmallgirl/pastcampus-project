import { TableCell } from "@mui/material";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { timeTableState } from "../store/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const TimeTableCell = ({ day, timeNum, Edit }) => {
  const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const timeData = useMemo(
    () =>
      timeTableData[day].find(
        (time) => time.start <= timeNum && timeNum < time.end
      ),
    [day, timeNum, timeTableData]
  );

  const handleEdit = useCallback(
    () => Edit(day, timeData.id),
    [Edit, timeData?.id, day]
  );

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handelDelete = useCallback(() => {
    setTimeTableData((oldTimeTableData) => {
      const newDayData = oldTimeTableData[day].filter(
        (data) => data.id !== timeData.id
      );
      return {
        ...oldTimeTableData,
        [day]: newDayData,
      };
    });

    setOpen(false);
  }, [day, setTimeTableData, timeData?.id]);

  const handleConfirm = useCallback(() => setOpen(true), [setOpen]);

  return (
    <>
      {timeData?.start === timeNum ? (
        <TableCell
          style={{ backgroundColor: timeData.color, position: "relative" }}
          align="center"
          rowSpan={timeData.end - timeData.start} // 강의 끝나는 시간 (11) - 강의 시작하는 시간 (9) = 2칸
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {timeData.name}
          {hover ? (
            <div style={{ position: "absolute", top: 5, right: 5 }}>
              <EditIcon style={{ cursor: "pointer" }} onClick={handleEdit} />
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={handleConfirm}
              />
            </div>
          ) : null}
        </TableCell>
      ) : timeData?.start < timeNum && timeNum < timeData?.end ? null : (
        <TableCell />
      )}
      <ConfirmModal
        open={open}
        handleClose={handleClose}
        handleDelete={handelDelete}
      />
    </>
  );
};

export default memo(TimeTableCell);
