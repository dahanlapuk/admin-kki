export default function Dashboard() {
  return (
    <div className="min-h-screen bg-accent">
      <nav className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Dashboard KKI</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">Admin User</span>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Request', value: '0', color: 'bg-blue-500' },
            { label: 'In Progress', value: '0', color: 'bg-yellow-500' },
            { label: 'Completed', value: '0', color: 'bg-green-500' },
            { label: 'Published', value: '0', color: 'bg-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl`}>
                {stat.value}
              </div>
              <h3 className="text-sm font-medium text-secondary-600">{stat.label}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Welcome to Dashboard KKI</h2>
          <p className="text-secondary-600">
            Dashboard ini sedang dalam tahap pengembangan. Fitur-fitur akan ditambahkan secara bertahap.
          </p>
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm text-primary-700 font-medium">🚧 Status: Phase 1 - Foundation</p>
            <p className="text-sm text-primary-600 mt-1">Backend API dan struktur database telah siap.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
