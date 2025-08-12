import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          BidMaster Pro
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🎉 Day 2: Frontend Foundation Complete!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800">✅ Vite Setup</h3>
              <p className="text-blue-600">Lightning-fast development server</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-800">✅ Tailwind CSS</h3>
              <p className="text-green-600">Utility-first styling working!</p>
            </div>
          </div>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Ready for Development!
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
