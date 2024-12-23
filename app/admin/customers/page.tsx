"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import customersData from "@/public/customersData"; // Corrected import path
import { Customer } from "@/types/customer"; // Import the Customer type
import { Edit, Trash2 } from "lucide-react";
const Customers = () => {
  // Typing the state with the Customer interface
  const [customers, setCustomers] = useState<Customer[]>(customersData);

  useEffect(() => {
    // Fetch customers data from backend (optional, if you want to replace static data with API data)
    fetch("/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data)) // Replace with fetched data if necessary
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin - Customers
      </h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105"
            >
              <td className="px-6 py-4">{customer.id}</td>
              <td className="px-6 py-4">{customer.name}</td>
              <td className="px-6 py-4">{customer.email}</td>
              <td className="px-6 py-4 flex space-x-4">
                <button
                  className="flex items-center text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
                  aria-label="Edit"
                >
                  <Edit className="mr-2" size={18} /> Edit
                </button>
                <button
                  className="flex items-center text-red-500 hover:text-red-700 transition duration-200 ease-in-out transform hover:scale-105"
                  aria-label="Delete"
                >
                  <Trash2 className="mr-2" size={18} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
