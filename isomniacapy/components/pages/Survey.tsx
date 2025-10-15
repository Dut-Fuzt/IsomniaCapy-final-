import React, { useState } from 'react';
import { SurveyData } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';

interface SurveyProps {
  onSubmit: (data: SurveyData) => void;
  onSkip: () => void;
}

const problemsOptions = ["Thức khuya", "Mất phương hướng", "Không có lịch học phù hợp"];
const needsOptions = ["Học thông minh và khoa học", "Áp dụng nhiều phương pháp học tập", "Không thức khuya", "Học cho có thêm kiến thức"];

const Survey: React.FC<SurveyProps> = ({ onSubmit, onSkip }) => {
  const [data, setData] = useState<SurveyData>({
    age: '',
    grade: '',
    problems: [],
    otherProblem: '',
    needs: [],
    otherNeed: '',
  });
  const [errors, setErrors] = useState<{ age?: string }>({});

  const handleProblemChange = (value: string, isChecked: boolean) => {
    setData(prev => {
        let newProblems = [...prev.problems];
        if (isChecked) {
            if (value === 'Không có') {
                newProblems = ['Không có'];
            } else {
                newProblems = newProblems.filter(p => p !== 'Không có');
                if (!newProblems.includes(value)) {
                    newProblems.push(value);
                }
            }
        } else {
            newProblems = newProblems.filter(p => p !== value);
        }
        return { ...prev, problems: newProblems, otherProblem: newProblems.includes('Khác') ? prev.otherProblem : '' };
    });
};

  const handleCheckboxChange = (
    field: 'needs',
    value: string
  ) => {
    setData((prev) => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };
  
  const validate = () => {
    const newErrors: { age?: string } = {};
    if (!data.age) {
        newErrors.age = "Phần này là bắt buộc.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
        onSubmit(data);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Khảo sát nhỏ</h1>
        <p className="text-center text-gray-500 mb-6">Để có trải nghiệm tốt nhất, vui lòng trả lời các câu hỏi sau.</p>
        <p className="text-center text-sm font-semibold text-purple-600 mb-8">Hãy làm trung thực nha, để AI có thể phân tích rõ được nhu cầu và vấn đề của bạn!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Bạn bao nhiêu tuổi?</label>
            <div className="flex gap-4 mt-2">
              {(['11-14', '15-18', '18+'] as const).map(age => (
                <button type="button" key={age} onClick={() => { setData(prev => ({ ...prev, age, grade: age === '18+' ? '' : prev.grade })); setErrors({}); }} className={`px-4 py-2 rounded-lg border-2 transition ${data.age === age ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:bg-blue-50 border-gray-300'}`}>
                  {age === '18+' ? `Từ ${age} tuổi` : `Từ ${age} tuổi`}
                </button>
              ))}
            </div>
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="grade" className="font-semibold text-gray-700">Bạn hiện tại đang học lớp mấy?</label>
            <input
              type="text"
              id="grade"
              placeholder="ví dụ: Lớp 9"
              value={data.grade}
              onChange={(e) => setData({ ...data, grade: e.target.value })}
              disabled={data.age === '18+'}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
            />
            {data.age !== '18+' && <p className="text-sm text-gray-400 mt-1">Gợi ý: Lớp 6 - Lớp 12</p>}
          </div>

          <div>
            <label className="font-semibold text-gray-700">Bạn hiện đang gặp vấn đề gì về học tập?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {problemsOptions.map(p => (
                <label key={p} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="checkbox" checked={data.problems.includes(p)} onChange={(e) => handleProblemChange(p, e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                  {p}
                </label>
              ))}
               <label className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="checkbox" checked={data.problems.includes('Không có')} onChange={(e) => handleProblemChange('Không có', e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                  Không có
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="checkbox" checked={data.problems.includes('Khác')} onChange={(e) => handleProblemChange('Khác', e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                  Khác
                </label>
            </div>
             <input
              type="text"
              placeholder="Vui lòng ghi rõ vấn đề khác..."
              value={data.otherProblem}
              disabled={!data.problems.includes('Khác')}
              onChange={(e) => setData({ ...data, otherProblem: e.target.value })}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Nhu cầu của bạn là gì?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {needsOptions.map(n => (
                <label key={n} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <input type="checkbox" checked={data.needs.includes(n)} onChange={() => handleCheckboxChange('needs', n)} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                  {n}
                </label>
              ))}
            </div>
             <input
              type="text"
              placeholder="Nhu cầu khác..."
              value={data.otherNeed}
              onChange={(e) => setData({ ...data, otherNeed: e.target.value })}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button type="submit">Gửi thông tin</Button>
            <Button onClick={onSkip} variant="ghost">Bỏ qua</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Survey;
