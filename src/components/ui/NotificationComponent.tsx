import {AlertTriangle, CheckCircle} from "lucide-react";

export function NotificationComponent(props: {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}) {
    let {type, message, onClose} = props;
    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            type === 'success' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        }`}
>
    {type === 'success' ? <CheckCircle className="mr-2 h-5 w-5"/> : <AlertTriangle className="mr-2 h-5 w-5"/>}
    {message}
    <button
        onClick={onClose}
    className="ml-4 text-sm font-medium text-white underline hover:text-gray-200 transition"
    aria-label="Fechar notificação"
        >
        Fechar
        </button>
        </div>
);
}
