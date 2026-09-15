import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { notificationApi } from "../api/endpoints.js";
import { useToast } from "../context/ToastContext.jsx";
import { EmptyState, PageLoader, SectionHeading } from "../components/ui.jsx";
import { timeAgo } from "../utils/format.js";

const Notifications = () => {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [unread, setUnread] = useState(0);

  const load = () =>
    notificationApi.list({ limit: 50 }).then(({ notifications, unread: count }) => {
      setItems(notifications);
      setUnread(count);
    });

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await notificationApi.markAllRead();
    toast.success("All notifications marked read");
    await load();
  };

  const open = async (n) => {
    if (!n.isRead) await notificationApi.markRead(n._id);
  };

  const remove = async (id) => {
    await notificationApi.remove(id);
    await load();
  };

  if (!items) return <PageLoader label="Loading notifications" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        action={unread > 0 && <button onClick={markAll} className="btn-ghost"><CheckCheck size={16} /> Mark all read</button>}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nothing here yet"
          description="Responses to your requests and matches for your blood group will show up here."
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
          {items.map((n) => (
            <li key={n._id} className={`flex items-start gap-3 px-5 py-4 ${n.isRead ? "" : "bg-paper"}`}>
              {!n.isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-urgent" aria-label="Unread" />}
              <div className={`min-w-0 flex-1 ${n.isRead ? "pl-5" : ""}`}>
                {n.link ? (
                  <Link to={n.link} onClick={() => open(n)} className="text-[15px] leading-snug hover:underline">
                    {n.message}
                  </Link>
                ) : (
                  <p className="text-[15px] leading-snug">{n.message}</p>
                )}
                <p className="mt-1 text-xs text-ink-muted">{timeAgo(n.createdAt)}</p>
              </div>
              <button onClick={() => remove(n._id)} className="btn-quiet p-2" aria-label="Remove notification">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
