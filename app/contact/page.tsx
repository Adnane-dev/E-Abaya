// app/contact/page.tsx
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
const ContactPage = () => {
  return (
    <div className=" mx-auto px-4 sm:px-6 ">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-gray-600">
          We would love to hear from you! Reach out to us for any questions,
          comments, or concerns.
        </p>

        {/* Contact Form */}
        <form className="mt-8 space-y-6" method="POST" action="#">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Your message here"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-gray-800">Our Office</h2>
          <p className="mt-2 text-gray-600">
            1234 Fashion Street, City, Country
          </p>
          <p className="mt-2 text-gray-600">Email: support@example.com</p>
          <p className="mt-2 text-gray-600">Phone: (123) 456-7890</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
