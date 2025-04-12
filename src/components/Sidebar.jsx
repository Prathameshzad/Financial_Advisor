import Link from 'next/link';

export default function Sidebar() {
  return (
    <div>
      <div className="w-64 h-screen bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
        <ul className="mt-4">
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard">Home</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard/profile">Profile</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard/stock-metrics">Stock Metrics</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard/finview">Finview</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard/widgets">Widgets</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <Link href="/dashboard/portfolio">Portfolio</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
