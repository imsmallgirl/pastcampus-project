import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { timeTableState } from "../store/store";
import { v4 as uuidv4 } from "uuid";

// select 태그의 option 만드는 함수
const timeOptions = new Array(12).fill(null).map((e, i) => ({
  value: i + 9,
  label: i + 9,
}));

//
const checkOverLap = (A, B) =>
  B.start < A.start ? B.end > A.start : B.start < A.end;

// 지금 들어온 시작시간이 있던 시작시간 작다면
// 지금 들어온 마지막 시간이 있던 시작 시간보다 큰가?
// 지금 들어온 시작시간이 있던 시작시간보다 크다면
// 지금 들어온 시작시간이 있던 마지막 시간보다 작은가?

const InputModal = ({
  showModal,
  handleClose,
  dayData = "mon",
  startTimeData = 9,
  endTimeData = 10,
  lectureNameData = "",
  colorData = "#00ff55",
  idNum,
}) => {
  const {
    formState: { errors },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm();

  const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);

  useEffect(() => {
    if (showModal) {
      reset({
        lectureName: lectureNameData,
        day: dayData,
        startTime: startTimeData,
        endTime: endTimeData,
        lectureColor: colorData,
      });
    }
  }, [
    showModal,
    reset,
    lectureNameData,
    dayData,
    startTimeData,
    endTimeData,
    colorData,
  ]);

  const Submit = useCallback(
    ({ lectureName, day, startTime, endTime, lectureColor }) => {
      let valid = true;
      for (let index = 0; index < timeTableData[day].length; index++) {
        if (
          checkOverLap(timeTableData[day][index], {
            start: startTime,
            end: endTime,
          })
        ) {
          valid = false;
          break;
        }
      } // 현재 입력한 값과 데이터의 있는 값과 중복을 체크함
      // true 일 경우 : 해당 시간에 이미 등록된 강의가 있음.
      // false 일 경우 : 해당 시간에 등록된 강의 없음

      if (!valid) {
        alert("해당 시간에 이미 등록된 강의가 있습니다.");
        return;
      }

      const data = {
        start: startTime,
        end: endTime,
        name: lectureName,
        color: lectureColor,
        id: uuidv4(),
      };

      setTimeTableData((oldTimeData) => ({
        ...oldTimeData,
        [day]: [...oldTimeData[day], data],
      }));

      handleClose();
    },
    [timeTableData, setTimeTableData, handleClose]
  );

  const Edit = useCallback(
    ({ lectureName, day, startTime, endTime, lectureColor }) => {
      let valid = true;
      for (let index = 0; index < timeTableData[day].length; index++) {
        if (
          checkOverLap(timeTableData[day][index], {
            start: startTime,
            end: endTime,
          }) &&
          timeTableData[day][index]["id"] !== idNum
        ) {
          valid = false;
          break;
        }
      } // 현재 입력한 값과 데이터의 있는 값과 중복을 체크함
      // true 일 경우 : 해당 시간에 이미 등록된 강의가 있음.
      // false 일 경우 : 해당 시간에 등록된 강의 없음

      if (!valid) {
        alert("해당 시간에 이미 등록된 강의가 있습니다.");
        return;
      }

      const filteredData = [
        ...timeTableData[dayData].filter((data) => data.id !== idNum),
      ];

      const newTimeTableData = {
        ...timeTableData,
        [dayData]: filteredData,
      };

      const newDayData = [
        ...newTimeTableData[day],
        {
          start: startTime,
          end: endTime,
          id: idNum,
          name: lectureName,
          color: lectureColor,
        },
      ];

      setTimeTableData({
        ...newTimeTableData,
        [day]: newDayData,
      });

      handleClose();
    },
    [dayData, handleClose, idNum, setTimeTableData, timeTableData]
  );

  return (
    <Dialog open={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit(idNum ? Edit : Submit)}>
        <DialogTitle>강의 정보 입력</DialogTitle>
        <DialogContent style={{ width: "400px" }}>
          <Controller
            control={control}
            name="lectureName"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.lectureName}
                style={{ marginTop: "30px", width: "350px" }}
                label="강의명"
                autoComplete="false"
              />
            )}
          />
          {errors.lectureName?.type === "required" && (
            <p style={{ color: "#d32f2f" }}>강의명을 입력해주세요</p>
          )}

          <FormControl style={{ marginTop: "30px" }}>
            <FormLabel>요일</FormLabel>
            <Controller
              control={control}
              name="day"
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field} style={{ display: "block" }}>
                  <FormControlLabel
                    value="mon"
                    control={<Radio />}
                    label="Mon"
                  />
                  <FormControlLabel
                    value="tue"
                    control={<Radio />}
                    label="Tue"
                  />
                  <FormControlLabel
                    value="wed"
                    control={<Radio />}
                    label="Wed"
                  />
                  <FormControlLabel
                    value="thu"
                    control={<Radio />}
                    label="Thu"
                  />
                  <FormControlLabel
                    value="fri"
                    control={<Radio />}
                    label="Fri"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <Stack spacing={3} style={{ marginTop: "30px", width: "350px" }}>
            <Controller
              control={control}
              name="startTime"
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  error={
                    !!errors.startTime ||
                    !!(errors.endTime?.type === "validate")
                  }
                  style={{ marginTop: "30px", width: "350px" }}
                  label="시작 시간"
                  placeholder="시작 시간 선택"
                >
                  {timeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.startTime?.type === "required" && (
              <p style={{ color: "#d32f2f" }}>강의 시작 시간을 확인해주세요.</p>
            )}
          </Stack>
          <Stack spacing={3} style={{ marginTop: "30px", width: "350px" }}>
            <Controller
              control={control}
              name="endTime"
              rules={{
                required: true,
                validate: (value) => getValues("startTime") < value,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  error={!!errors.endTime}
                  style={{ marginTop: "30px", width: "350px" }}
                  label="종료 시간"
                  placeholder="종료 시간 선택"
                >
                  {timeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.endTime?.type === "required" && (
              <p style={{ color: "#d32f2f" }}>강의 종료 시간을 확인해주세요.</p>
            )}
            {errors.endTime?.type === "validate" && (
              <p style={{ color: "#d32f2f" }}>
                시작시간과 종료시간을 확인해주세요.
              </p>
            )}
          </Stack>
          <div style={{ marginTop: "30px" }}>
            <label htmlFor="lectureColor">시간표 색상 :</label>
            <Controller
              control={control}
              name="lectureColor"
              render={({ field }) => (
                <input
                  {...field}
                  style={{ marginTop: "30px" }}
                  id="lectureColor"
                  type="color"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit">입력</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InputModal;
