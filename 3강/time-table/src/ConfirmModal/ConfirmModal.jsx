import { DialogTitle } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Dialog } from "@mui/material";
import React from "react";

const ConfirmModal = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>강의 삭제</DialogTitle>
      <DialogContent>
        <DialogContentText>해당 강의를 삭제하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleDelete}>삭제</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
