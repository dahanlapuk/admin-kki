import { Link } from 'react-router-dom';

// 404 Not Found Page Component
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-xl text-secondary-600">Halaman tidak ditemukan</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
