'use client';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    des: '',
    day: '',
    startTime: '',
    status: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({
      name: '',
      des: '',
      day: '',
      startTime: '',
      status: '',
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('https://api.sheety.co/3c7c3623a853df11ca16bca8577a9f03/workflow/work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work: {
            "ผู้ทำงาน": form.name,
            "รายละเอียดงาน": form.des,
            "วันที่ทำงาน": form.day,
            "เวลาที่ทำ": form.startTime,
            "สถานะ": "รออนุมัติ",
          },
        }),
      });

      if (res.ok) {
        alert('ส่งข้อมูลเรียบร้อยแล้ว!');
        resetForm(); // รีเซ็ตฟอร์มหลังส่งสำเร็จ
      } else {
        const error = await res.text();
        alert('เกิดข้อผิดพลาด: ' + error);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ฟอร์มออกไปทำงาน</h1>
            <p className="text-gray-500 text-sm">กรุณากรอกข้อมูลให้ครบถ้วน</p>
          </div>

          {/* Form */}
          <div onSubmit={handleSubmit} className="space-y-6">
            {/* ชื่อ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ชื่อผู้ทำงาน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="กรอกชื่อของคุณ"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* รายละเอียดงาน */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                รายละเอียดงาน <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.des}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                placeholder="อธิบายรายละเอียดงานที่จะทำ"
                onChange={(e) => setForm({ ...form, des: e.target.value })}
                required
              />
            </div>

            {/* วันที่ทำงาน */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                วันที่ทำงาน <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.day}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                required
              />
            </div>

            {/* เวลาที่ทำ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                เวลาที่ทำงาน <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={form.startTime}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 transform ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>กำลังส่ง...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>ส่งข้อมูล</span>
                </div>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetForm}
              className="w-full py-3 px-6 rounded-xl text-gray-600 font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              ล้างข้อมูล
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              ข้อมูลจะถูกส่งไปยังระบบเพื่อรออนุมัติ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}