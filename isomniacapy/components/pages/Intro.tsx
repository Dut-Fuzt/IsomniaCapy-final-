
import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface IntroProps {
  onNext: () => void;
}

const Intro: React.FC<IntroProps> = ({ onNext }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
       <div className="absolute top-0 left-0 w-full h-12 bg-white/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
        <p className="text-xl font-bold text-gray-700 animate-marquee whitespace-nowrap">
          Welcome to IsomniaCapy! Welcome to IsomniaCapy! Welcome to IsomniaCapy! Welcome to IsomniaCapy! Welcome to IsomniaCapy!
        </p>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
        `}</style>
      </div>

      <Card className="text-center max-w-2xl animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
          Chào mừng bạn đến với IsomniaCapy!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cảm ơn vì đã lựa chọn công cụ này để đồng hành cùng bạn trong chặng hành trình học tập sắp tới.
        </p>
        <div className="flex justify-center gap-4">
            <Button onClick={onNext}>
                Bắt đầu hành trình →
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default Intro;
