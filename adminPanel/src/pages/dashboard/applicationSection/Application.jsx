import React, { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, MoreVertical, Users, ArrowLeft, FileText, Briefcase, Heart, Star, Palette, Newspaper, DollarSign, Music, Store } from 'lucide-react';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('overview'); // 'overview' or specific type
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for different request types
  const requests = [
    { id: 1, type: 'Fashion Designer', name: 'Sarah Johnson', email: 'sarah@example.com', date: '2024-11-08', status: 'pending', portfolio: 'www.portfolio.com', phone: '+1234567890' },
    { id: 2, type: 'Student Design', name: 'Mike Chen', email: 'mike@example.com', date: '2024-11-07', status: 'approved', school: 'Design Institute', phone: '+1234567891' },
    { id: 3, type: 'Volunteer', name: 'Emma Wilson', email: 'emma@example.com', date: '2024-11-06', status: 'pending', availability: 'Weekends', phone: '+1234567892' },
    { id: 4, type: 'Top Models', name: 'Alex Rivera', email: 'alex@example.com', date: '2024-11-08', status: 'pending', height: '5\'10"', phone: '+1234567893' },
    { id: 5, type: 'Fine Artist', name: 'David Kim', email: 'david@example.com', date: '2024-11-05', status: 'approved', medium: 'Oil Painting', phone: '+1234567894' },
    { id: 6, type: 'Press & Media', name: 'Jessica Brown', email: 'jessica@example.com', date: '2024-11-08', status: 'pending', outlet: 'Fashion Daily', phone: '+1234567895' },
    { id: 7, type: 'SponsorShip', name: 'TechCorp Inc', email: 'contact@techcorp.com', date: '2024-11-07', status: 'approved', amount: '$10,000', phone: '+1234567896' },
    { id: 8, type: 'Performances', name: 'The Dance Crew', email: 'crew@example.com', date: '2024-11-06', status: 'pending', duration: '15 mins', phone: '+1234567897' },
    { id: 9, type: 'Booth Table', name: 'Artisan Crafts', email: 'artisan@example.com', date: '2024-11-08', status: 'rejected', boothSize: '10x10', phone: '+1234567898' },
    { id: 10, type: 'Fashion Designer', name: 'Lisa Martinez', email: 'lisa@example.com', date: '2024-11-05', status: 'approved', portfolio: 'www.lisamartinez.com', phone: '+1234567899' },
    { id: 11, type: 'Volunteer', name: 'Tom Anderson', email: 'tom@example.com', date: '2024-11-08', status: 'pending', availability: 'Full-time', phone: '+1234567800' },
    { id: 12, type: 'SponsorShip', name: 'Fashion House Ltd', email: 'sponsor@fh.com', date: '2024-11-07', status: 'pending', amount: '$25,000', phone: '+1234567801' },
    { id: 13, type: 'Top Models', name: 'Sophia Lee', email: 'sophia@example.com', date: '2024-11-07', status: 'approved', height: '5\'9"', phone: '+1234567802' },
    { id: 14, type: 'Student Design', name: 'Jake Wilson', email: 'jake@example.com', date: '2024-11-08', status: 'pending', school: 'Art Academy', phone: '+1234567803' },
    { id: 15, type: 'Fine Artist', name: 'Maria Garcia', email: 'maria@example.com', date: '2024-11-06', status: 'pending', medium: 'Sculpture', phone: '+1234567804' },
  ];

  const requestTypes = [
    { name: 'Fashion Designer', icon: Briefcase, color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { name: 'Student Design', icon: FileText, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { name: 'Volunteer', icon: Heart, color: 'pink', bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
    { name: 'Top Models', icon: Star, color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { name: 'Fine Artist', icon: Palette, color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
    { name: 'Press & Media', icon: Newspaper, color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
    { name: 'SponsorShip', icon: DollarSign, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { name: 'Performances', icon: Music, color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-600' },
    { name: 'Booth Table', icon: Store, color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  ];

  // Get count for each type
  const getTypeCount = (typeName) => {
    return requests.filter(r => r.type === typeName).length;
  };

  const getTypePendingCount = (typeName) => {
    return requests.filter(r => r.type === typeName && r.status === 'pending').length;
  };

  // Statistics calculation
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  // Filter requests for detail view
  const filteredRequests = requests.filter(request => {
    const matchesType = currentView === 'overview' || request.type === currentView;
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    
    return matchesType && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`Request ${id} status changed to ${newStatus}`);
    // Add your API call here
  };

  const handleViewDetails = (request) => {
    console.log('View details:', request);
    // Add your modal or navigation logic here
  };

  const handleTypeClick = (typeName) => {
    setCurrentView(typeName);
    setSearchTerm('');
    setSelectedStatus('all');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSearchTerm('');
    setSelectedStatus('all');
  };

  // Overview Page
  if (currentView === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">All applications</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Awaiting review</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Successfully processed</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">Not approved</p>
            </div>
          </div>

          {/* Application Types Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                const count = getTypeCount(type.name);
                const pendingCount = getTypePendingCount(type.name);
                
                return (
                  <button
                    key={type.name}
                    onClick={() => handleTypeClick(type.name)}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${type.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={type.textColor} size={24} />
                      </div>
                      {pendingCount > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                    <p className="text-2xl font-bold text-gray-700 mb-2">{count}</p>
                    <p className="text-sm text-gray-500">Total applications</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail View Page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentView}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRequests.length} application{filteredRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats for this type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {requests.filter(r => r.type === currentView).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {requests.filter(r => r.type === currentView && r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {requests.filter(r => r.type === currentView && r.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0">
                            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {request.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.email}</div>
                        <div className="text-sm text-gray-500">{request.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(request.id, 'approved')}
                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition"
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(request.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded transition">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredRequests.length}</span> application{filteredRequests.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;