import {
    Wallet,
    PieChart,
    Users,
    CreditCard,
    TrendingUp,
    TrendingDown,
  } from "lucide-react";
  
  const cardData = [
    {
      icon: <Wallet className="w-6 h-6" />,
      value: "$143,624",
      label: "Your bank balance",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      value: "12",
      label: "Uncategorized transactions",
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "7",
      label: "Employees working today",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      value: "$3,287.49",
      label: "This week's card spending",
    },
  ];
  
  const emails = [
    {
      name: "Hannah Morgan",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Meeting scheduled",
      time: "1:24 PM",
    },
    {
      name: "Megan Clark",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      message: "Update on marketing campaign",
      time: "12:32 PM",
    },
    {
      name: "Brandon Williams",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      message: "Designly 2.0 is about to launch",
      time: "Yesterday at 8:57 PM",
    },
    {
      name: "Reid Smith",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      message: "My friend Julie loves Dappr!",
      time: "Yesterday at 8:49 PM",
    },
  ];
  
  export default function Dashboard() {
    return (
      <div className="p-6 bg-[#e7f1f6] min-h-screen space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 justify-between p-4 bg-[#dbe8ee] rounded-xl shadow-md text-black"
            >
              <div className="flex justify-between items-start">
                {card.icon}
                <div className="text-xl font-bold">•••</div>
              </div>
              <div className="text-2xl font-semibold">{card.value}</div>
              <div className="text-sm text-gray-700">{card.label}</div>
            </div>
          ))}
        </div>
  
        {/* Clients & Revenue Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New Clients & Invoices */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm">New clients</div>
              <div className="text-3xl font-bold">54</div>
              <div className="flex items-center text-green-500 font-medium text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18.7%
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-gray-500 text-sm">Invoices overdue</div>
              <div className="text-3xl font-bold">6</div>
              <div className="flex items-center text-red-500 font-medium text-sm mt-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                +2.7%
              </div>
            </div>
          </div>
  
          {/* Revenue Chart (Placeholder) */}
          <div className="col-span-2 bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Revenue</h2>
              <p className="text-sm text-gray-500">Last 7 days VS prior week</p>
            </div>
            <div className="bg-[#dbe8ee] h-36 rounded-xl flex items-center justify-center text-gray-400 italic">
              Chart Placeholder
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {["Feb 14", "Feb 15", "Feb 16", "Feb 17", "Feb 18", "Feb 19", "Feb 20"].map((date) => (
                <span key={date}>{date}</span>
              ))}
            </div>
          </div>
        </div>
  
        {/* Recent Emails */}
        <div className="bg-[#dbe8ee] p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Recent emails</h3>
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={email.avatar}
                    alt={email.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{email.name}</div>
                    <div className="text-sm text-gray-600">{email.message}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{email.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  