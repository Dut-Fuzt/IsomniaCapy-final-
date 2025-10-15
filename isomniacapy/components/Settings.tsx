import React from 'react';
import Card from './common/Card';

interface SettingsProps {
    settings: {
        capyFollowsMouse: boolean;
        showCapy: boolean;
    };
    setSettings: React.Dispatch<React.SetStateAction<{ capyFollowsMouse: boolean; showCapy: boolean }>>;
    onClose: () => void;
}

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean; }> = ({ checked, onChange, label, disabled = false }) => (
    <label className={`flex items-center justify-between cursor-pointer p-4 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
        <span className="font-semibold text-gray-700">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={e => !disabled && onChange(e.target.checked)} disabled={disabled} />
            <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${checked ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);


const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Cài đặt</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                
                <div className="space-y-2">
                    <Toggle 
                        label="Hiện Capybara"
                        checked={settings.showCapy}
                        onChange={(checked) => setSettings(s => ({...s, showCapy: checked}))}
                    />
                    <Toggle 
                        label="Capybara nhìn theo chuột"
                        checked={settings.capyFollowsMouse}
                        onChange={(checked) => setSettings(s => ({...s, capyFollowsMouse: checked}))}
                        disabled={!settings.showCapy}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Settings;
