import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiConnector from "../services/apiConnector";
import { resourceEndPoints } from "../services/api";
import ResoruceItem from "../components/ResoruceItem"; // Ensure correct import

const AllAgencyResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllResources = async () => {
      try {
        const res = await apiConnector({
          method: "GET",
          url: resourceEndPoints.LIST_RESOURCES_API,
        });
        setResources(res.resources || []);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch resources from all agencies.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchAllResources();
  }, []);

  useEffect(() => {
    let filtered = [...resources];

    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        (r) => r.availability === (availabilityFilter === "yes")
      );
    }

    if (quantityFilter) {
      filtered = filtered.filter(
        (r) => parseInt(r.quantity) >= parseInt(quantityFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((r) =>
        r.status.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, availabilityFilter, quantityFilter, statusFilter]);

  const handleDeleteResource = (id) => {
    setResources((prev) => prev.filter((r) => r._id !== id));
  };

  const allStatuses = Array.from(new Set(resources.map((r) => r.status)));

  if (loading) {
    return <div className="text-center mt-10">Loading resources...</div>;
  }

  return (
    <div className="w-11/12 mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        All Agency Resources
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 border border-gray-300 px-4 py-2 rounded-md shadow"
        />
        <select
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="w-full sm:w-1/4 border border-gray-300 px-4 py-2 rounded-md shadow"
        >
          <option value="all">All Availability</option>
          <option value="yes">Available</option>
          <option value="no">Not Available</option>
        </select>
        <input
          type="number"
          placeholder="Min Quantity"
          onChange={(e) => setQuantityFilter(e.target.value)}
          className="w-full sm:w-1/4 border border-gray-300 px-4 py-2 rounded-md shadow"
        />
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/4 border border-gray-300 px-4 py-2 rounded-md shadow"
        >
          <option value="">All Statuses</option>
          {allStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredResources
          .filter((r) =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((resource) => (
            <ResoruceItem
              key={resource._id}
              resource={resource}
              onDelete={handleDeleteResource}
            />
          ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No resources match your filters.
        </div>
      )}
    </div>
  );
};

export default AllAgencyResources;
