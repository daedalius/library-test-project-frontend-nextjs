import React from "react";
import ReactModal from "react-modal";

import styles from "./styles.module.css";

export const Modal = React.memo(
  (props: {
    isOpen: boolean;
    children: React.ReactNode;
    shouldCloseOnEsc?: boolean;
  }) => {
    return (
      <ReactModal
        shouldCloseOnEsc={props.shouldCloseOnEsc}
        className={styles.contentWrapper}
        overlayClassName={styles.modal}
        isOpen={props.isOpen}
      >
        {props.children}
      </ReactModal>
    );
  }
);
Modal.displayName = "Modal";
