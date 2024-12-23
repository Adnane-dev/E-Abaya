"use client"; // Mark this component as a Client Component

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Exemple de données par défaut pour les paramètres
const defaultSettings = {
  theme: "light",
  notifications: true,
  language: "en",
};

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultSettings,
  });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      // Envoi des données vers une API (ici une simulation)
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (error) {
      toast.error("Error saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset(defaultSettings);
    toast.info("Settings have been reset to default.");
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin - Settings
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-medium text-gray-700">Appearance</h2>
          <div className="mt-2">
            <label
              htmlFor="theme"
              className="block text-sm font-semibold text-gray-600"
            >
              Theme
            </label>
            <select
              id="theme"
              {...register("theme")}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-700">Notifications</h2>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="notifications"
              {...register("notifications")}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="notifications"
              className="ml-2 text-sm font-semibold text-gray-600"
            >
              Enable Notifications
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-700">Language</h2>
          <div className="mt-2">
            <label
              htmlFor="language"
              className="block text-sm font-semibold text-gray-600"
            >
              Language
            </label>
            <select
              id="language"
              {...register("language")}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
          >
            Reset to Default
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
