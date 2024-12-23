// app/designers/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const DesignersPage = () => {
  return (
    <div className="bg-white">
      <Navbar /> {/* Add the Navbar component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Our Designers</h1>
        <p className="mt-4 text-gray-600">
          Meet the talented designers behind our exclusive collections. Our team
          of skilled artisans and fashion experts work tirelessly to bring you
          innovative and high-quality pieces that reflect the essence of modest
          fashion.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Featured Designers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">Designer 1</h3>
              <p className="text-gray-600">
                Description of the designer s work and style.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">Designer 2</h3>
              <p className="text-gray-600">
                Description of the designer s work and style.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">Designer 3</h3>
              <p className="text-gray-600">
                Description of the designer s work and style.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Add the Footer component */}
    </div>
  );
};

export default DesignersPage;
