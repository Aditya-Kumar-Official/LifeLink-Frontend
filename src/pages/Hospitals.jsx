import { useCallback, useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { hospitalApi } from "../api/endpoints.js";
import HospitalCard from "../components/HospitalCard.jsx";
import { EmptyState, Field, Input, Select, SectionHeading, Spinner, Pagination } from "../components/ui.jsx";

const Hospitals = () => {
  const [filters, setFilters] = useState({ search: "", city: "", emergency: false, bloodBank: false });
  const [cities, setCities] = useState([]);
  const [data, setData] = useState({ hospitals: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.cities().then(({ cities: list }) => setCities(list)).catch(() => setCities([]));
  }, []);

  const search = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        setData(
          await hospitalApi.search({
            ...(filters.search && { search: filters.search }),
            ...(filters.city && { city: filters.city }),
            ...(filters.emergency && { emergency: "true" }),
            ...(filters.bloodBank && { bloodBank: "true" }),
            page,
            limit: 12,
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => { search(1); }, [search]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Hospital directory"
        description="Which hospitals take emergencies, which run a blood bank, and when they're open."
      />

      <div className="card mb-8 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Hospital name">
            <Input name="search" value={filters.search} onChange={change} placeholder="Search by name" />
          </Field>
          <Field label="City">
            <Select name="city" value={filters.city} onChange={change}>
              <option value="">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <label className="mt-6 flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm">
            <input type="checkbox" name="emergency" checked={filters.emergency} onChange={change} className="h-4 w-4 accent-[#C21B2E]" />
            Emergency services
          </label>
          <label className="mt-6 flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2.5 text-sm">
            <input type="checkbox" name="bloodBank" checked={filters.bloodBank} onChange={change} className="h-4 w-4 accent-[#1F7A66]" />
            Blood bank on site
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-ink-muted"><Spinner size={22} /></div>
      ) : data.hospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hospitals match those filters"
          description="Try clearing the city or the blood bank filter."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">{data.total} hospital{data.total === 1 ? "" : "s"}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.hospitals.map((h) => <HospitalCard key={h._id} hospital={h} />)}
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={search} />
        </>
      )}
    </div>
  );
};

export default Hospitals;
