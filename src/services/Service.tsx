import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apis/api";

interface ServiceForm {
  name: string;
  description: string;
  price: string;
  icon: string;
  category: string;
}

const EMPTY_FORM: ServiceForm = {
  name: "",
  description: "",
  price: "",
  icon: "",
  category: "",
};

export const Service = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await api.post("/service-provider/service", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        icon: form.icon,
        category: form.category,
      });

      setForm(EMPTY_FORM);
      navigate("/service-provider/provide-services");
    } catch (err: any) {
      console.error("Error adding service:", err.message, err.response?.status, err.response?.data);

      if (err.response?.status === 401) {
        setError("You are not authorized to add a service.");
      } else if (err.response?.status === 403) {
        setError("Access denied.");
      } else {
        setError("Unable to add service. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="mb-6">
          <p className="text-xs font-medium tracking-wide text-[#0F5257]">Service provider</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Add a service</h1>
          <p className="mt-1 text-sm text-slate-500">
            Describe what you offer so customers can find and book it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg p-6 space-y-5"
        >
          {error && (
            <div className="border border-red-200 bg-red-50 rounded-md px-3 py-2">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="CCTV installation"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5257]/40 focus:border-[#0F5257]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does this service include?"
              required
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5257]/40 focus:border-[#0F5257] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="499"
                min="0"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5257]/40 focus:border-[#0F5257]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="📹"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5257]/40 focus:border-[#0F5257]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Security"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5257]/40 focus:border-[#0F5257]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[#0F5257] text-white text-sm font-medium py-2.5 hover:bg-[#0C4247] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Adding service…" : "Add service"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full text-sm text-slate-500 hover:text-slate-700 py-1"
          >
            Back to home
          </button>
        </form>
      </div>
    </div>
  );
};
