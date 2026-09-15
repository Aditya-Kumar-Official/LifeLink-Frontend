import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { donorApi } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import DonorCard from "../components/DonorCard.jsx";
import { EmptyState, Field, Input, Select, SectionHeading, Spinner, Pagination } from "../components/ui.jsx";
import { AVAILABILITY, BLOOD_GROUPS } from "../utils/constants.js";

const FindDonors = () => {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    bloodGroup: params.get("bloodGroup") || "",
    city: params.get("city") || "",
    availability: params.get("availability") || "",
    eligibleOnly: params.get("eligibleOnly") === "true",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ donors: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = useCallback(
    async (nextPage = page) => {
      setLoading(true);
      setError("");
      try {
        const query = {
          ...(filters.bloodGroup && { bloodGroup: filters.bloodGroup }),
          ...(filters.city && { city: filters.city }),
          ...(filters.availability && { availability: filters.availability }),
          ...(filters.eligibleOnly && { eligibleOnly: "true" }),
          page: nextPage,
          limit: 12,
        };
        setParams(Object.fromEntries(Object.entries(query).filter(([k]) => k !== "limit")), { replace: true });
        setData(await donorApi.search(query));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, setParams]
  );

  useEffect(() => {
    search(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const clear = () => setFilters({ bloodGroup: "", city: "", availability: "", eligibleOnly: false });
  const goTo = (p) => { setPage(p); search(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Find a blood donor"
        description="Filter by blood group, city and availability. Phone numbers are shown to signed-in users only."
      />

      <form onSubmit={(e) => { e.preventDefault(); search(1); }} className="card mb-8 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Blood group">
            <Select name="bloodGroup" value={filters.bloodGroup} onChange={change}>
              <option value="">Any group</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="City">
            <Input name="city" value={filters.city} onChange={change} placeholder="Kolkata" />
          </Field>
          <Field label="Availability">
            <Select name="availability" value={filters.availability} onChange={change}>
              <option value="">Any status</option>
              {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
          </Field>
          <div className="flex items-end gap-2">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm">
              <input type="checkbox" name="eligibleOnly" checked={filters.eligibleOnly} onChange={change} className="h-4 w-4 accent-[#0E3339]" />
              Eligible today only
            </label>
            <button type="button" onClick={clear} className="btn-quiet btn-sm">Clear</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : error ? (
        <EmptyState icon={SearchX} title="Search failed" description={error} />
      ) : data.donors.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No donors match those filters"
          description="Try a wider search — clear the city, or drop the availability filter. Compatible groups often work even when the exact group isn't listed."
          action={<button onClick={clear} className="btn-ghost mt-1"><SlidersHorizontal size={15} /> Reset filters</button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            {data.total} donor{data.total === 1 ? "" : "s"} found
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.donors.map((d) => <DonorCard key={d._id} donor={d} canContact={isAuthenticated} />)}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={goTo} />
        </>
      )}
    </div>
  );
};

export default FindDonors;
