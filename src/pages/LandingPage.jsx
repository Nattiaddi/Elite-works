import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-blue-600 py-20 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">እንኳን ወደ Elite Works በሰላም መጡ</h1>
        <p className="text-xl opacity-90">ለእርስዎ ጥራት ያላቸውን ስራዎች በፍጥነት እናቀርባለን</p>
        <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
          ስራዎቻችንን ይመልከቱ
        </button>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-3">ጥራት</h3>
            <p className="text-gray-600">ሁልጊዜም ለደንበኞቻችን ምርጥ ጥራት ያለው ስራ እናቀርባለን።</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-3">ፍጥነት</h3>
            <p className="text-gray-600">ስራዎን በተባለው ጊዜ እና ሰዓት አጠናቀን እናስረክባለን።</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-3">ታማኝነት</h3>
            <p className="text-gray-600">በስራችን ታማኝ እና ግልጽነት ያለን ድርጅት ነን።</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Elite Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;