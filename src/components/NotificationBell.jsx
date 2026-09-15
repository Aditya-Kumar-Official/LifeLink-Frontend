import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { notificationApi } from "../api/endpoints.js";
import { timeAgo } from "../utils/format.js";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { notifications, unread: count } = await notificationApi.list({ limit: 8 });
      setItems(notifications);
      setUnread(count);
    } catch {
      /* the bell stays quiet if the poll fails */
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 45000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openPanel = async () => {
    setOpen((v) => !v);
    if (!open) await load();
  };

  const markAll = async () => {
    await notificationApi.markAllRead();
    setUnread(0);
    setItems((list) => list.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={openPanel} className="btn-quiet relative p-2" aria-label={`Notifications, ${unread} unread`}>
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-urgent px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[min(92vw,20rem)] overflow-hidden rounded-xl2 border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="text-sm font-medium">Notifications</p>
            {unread > 0 && (
              <button onClick={markAll} className="text-[13px] text-ink-muted hover:text-ink">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {items.length === 0 && <li className="px-4 py-8 text-center text-sm text-ink-muted">Nothing here yet.</li>}
            {items.map((n) => (
              <li key={n._id} className={n.isRead ? "" : "bg-paper"}>
                <Link to={n.link || "/notifications"} onClick={() => setOpen(false)} className="block px-4 py-3">
                  <p className="text-sm leading-snug">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-muted">{timeAgo(n.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-2.5 text-center text-[13px] text-ink-soft hover:bg-paper">
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
