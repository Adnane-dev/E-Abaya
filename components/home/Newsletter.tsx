export function Newsletter() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join our newsletter for updates on our latest collections, exclusive
            offers, and more.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <form className="w-full max-w-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Input field */}
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                required
              />
              {/* Submit button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
        {/* Optional decorative line */}
        <div className="mt-10">
          <p className="text-sm text-gray-500">
            We care about your privacy. Read our{" "}
            <a
              href="/privacy"
              className="underline text-primary hover:text-primary-dark"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
