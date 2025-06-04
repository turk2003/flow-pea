'use client';
import { useEffect, useState } from 'react';

type Row = {
  id: number;
  "ผู้ทำงาน": string;
  "รายละเอียดงาน": string;
  "วันที่ทำงาน": string;
  "สถานะ": string;
};

export default function Approve() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.sheety.co/3c7c3623a853df11ca16bca8577a9f03/workflow/work');
      const json = await res.json();
      
      // กรองข้อมูลเฉพาะที่มีสถานะ "รออนุมัติ"
      const pendingData = json.work.filter((item: Row) => item["สถานะ"] === 'รออนุมัติ');
      setData(pendingData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    setApproving(id);
    try {
      const res = await fetch(`https://api.sheety.co/3c7c3623a853df11ca16bca8577a9f03/workflow/work/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work: {
            "สถานะ": 'อนุมัติ',
          },
        }),
      });

      if (res.ok) {
        // ลบรายการที่อนุมัติแล้วออกจาก state โดยไม่ต้องโหลดใหม่
        setData(prevData => prevData.filter(item => item.id !== id));
        alert('อนุมัติเรียบร้อยแล้ว!');
      } else {
        alert('เกิดข้อผิดพลาดในการอนุมัติ');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติ');
    }
    setApproving(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">รายการรออนุมัติ</h1>
                <p className="text-gray-500">จัดการคำขออนุมัติงาน</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-gray-600">กำลังโหลด...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">ไม่มีรายการรออนุมัติ</h3>
              <p className="text-gray-500">ขณะนี้ไม่มีงานที่รออนุมัติในระบบ</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ผู้ทำงาน</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">รายละเอียดงาน</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">วันที่และเวลา</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">สถานะ</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium text-sm">
                                {row["ผู้ทำงาน"]?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <span className="text-gray-900 font-medium">{row["ผู้ทำงาน"]}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 max-w-xs truncate" title={row["รายละเอียดงาน"]}>
                            {row["รายละเอียดงาน"]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">
                            <div className="font-medium">{row["วันที่ทำงาน"]}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {row["สถานะ"]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleApprove(row.id)}
                            disabled={approving === row.id}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approving === row.id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังอนุมัติ...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                อนุมัติ
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {data.map((row) => (
                  <div key={row.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">
                            {row["ผู้ทำงาน"]?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{row["ผู้ทำงาน"]}</h3>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {row["สถานะ"]}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">รายละเอียดงาน:</span>
                        <p className="text-gray-900 mt-1">{row["รายละเอียดงาน"]}</p>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">วันที่:</span>
                          <p className="text-gray-900">{row["วันที่ทำงาน"]}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">เวลา:</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApprove(row.id)}
                      disabled={approving === row.id}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {approving === row.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          กำลังอนุมัติ...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          อนุมัติ
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        {data.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{data.length}</span>
                </div>
                <span className="text-gray-700 font-medium">รายการรออนุมัติทั้งหมด</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}