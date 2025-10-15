
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface FeaturesProps {
  onNext: () => void;
  onSkip: () => void;
}

const features = [
  { icon: '🎯', text: 'Thiết kế lộ trình học phù hợp với mỗi cá nhân.' },
  { icon: '⏳', text: 'Phân bổ thời gian phù hợp cho từng môn học.' },
  { icon: '📈', text: 'Theo dõi kỹ lưỡng sự tiến bộ theo thời gian.' },
];

const meanings = [
  { icon: '💡', text: 'Cải thiện hiệu quả học tập.' },
  { icon: '🥗', text: 'Cân bằng giữa học tập, sinh hoạt và giải trí.' },
  { icon: '❤️', text: 'Nâng cao sức khỏe thể chất và tinh thần.' },
];

const AnimatedListItem: React.FC<{ item: { icon: string; text: string }; delay: number }> = ({ item, delay }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <li className={`flex items-start gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-2xl mt-1">{item.icon}</span>
            <span className="text-lg text-gray-700">{item.text}</span>
        </li>
    )
}

const Features: React.FC<FeaturesProps> = ({ onNext, onSkip }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mục đích</h2>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <AnimatedListItem key={index} item={feature} delay={index * 300} />
                    ))}
                </ul>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ý nghĩa</h2>
                <ul className="space-y-4">
                    {meanings.map((meaning, index) => (
                        <AnimatedListItem key={index} item={meaning} delay={(index + features.length) * 300} />
                    ))}
                </ul>
            </div>
        </div>
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
            <Button onClick={onNext} variant="primary">Tiếp tục</Button>
            <Button onClick={onSkip} variant="ghost">Bỏ qua</Button>
        </div>
      </Card>
    </div>
  );
};

export default Features;
