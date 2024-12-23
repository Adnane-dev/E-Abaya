// app/sustainability/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SustainabilityPage = () => {
  return (
    <div className="bg-white">
      <Navbar /> {/* Add the Navbar component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Our Commitment to Sustainability
        </h1>
        <p className="mt-4 text-gray-600">
          At Islamic Fashion, sustainability is at the heart of what we do. We
          are committed to creating products that not only reflect our values
          but also contribute positively to the environment. Our dedication to
          ethical practices ensures that every piece we create is crafted with
          care for both the planet and its people.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sustainable Practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Eco-Friendly Materials
              </h3>
              <p className="text-gray-600">
                We prioritize using organic and recycled materials in all our
                designs, ensuring that each piece is both beautiful and
                environmentally friendly.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Ethical Production
              </h3>
              <p className="text-gray-600">
                Our garments are produced in facilities that uphold fair labor
                practices, ensuring safe working conditions and fair wages for
                all our artisans.
              </p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Reducing Waste
              </h3>
              <p className="text-gray-600">
                We work to minimize waste at every step of the production
                process, from cutting patterns to packaging, to ensure we are
                contributing to a circular economy.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Add the Footer component */}
    </div>
  );
};

export default SustainabilityPage;
