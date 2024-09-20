import React, { useState, useEffect } from 'react';
import { appointSubAdmin } from '../../../apicalls/users';
import { getAllExams } from '../../../apicalls/exams';

const SettingsPage = () => {
  const [email, setEmail] = useState('');
  const [selectedExams, setSelectedExams] = useState([]); // State for multiple selected exams
  const [exams, setExams] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Passing the selected exam IDs to the backend
      const examIds = selectedExams; // Array of selected exams
      const response = await appointSubAdmin({ email, examIds });
      if (response.success) {
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Error appointing sub-admin');
    }
  };

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        alert(response.message);
      }
    };
    fetchExams();
  }, []);
  return (
    <div className="settings p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Settings</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
    <div>
      <label htmlFor="exams" className="block text-sm font-medium text-gray-700">Exams:</label>
      <select
        id="exams"
        multiple
        value={selectedExams}
        onChange={(e) =>
          setSelectedExams([...e.target.selectedOptions].map(option => option.value))
        }
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        
        {exams.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
    <button
      type="submit"
      className="w-full py-2 px-4 bg-[#0f3460] text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Appoint as Sub-Admin
    </button>
  </form>
</div>

  );
};

export default SettingsPage;
