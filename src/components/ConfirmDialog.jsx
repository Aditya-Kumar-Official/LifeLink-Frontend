import Modal from "./Modal.jsx";
import { Spinner } from "./ui.jsx";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", busy, danger }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    width="max-w-md"
    footer={
      <>
        <button className="btn-ghost" onClick={onClose} disabled={busy}>
          Keep it
        </button>
        <button className={danger ? "btn-urgent" : "btn-primary"} onClick={onConfirm} disabled={busy}>
          {busy && <Spinner size={15} />}
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm text-ink-muted">{message}</p>
  </Modal>
);

export default ConfirmDialog;
