import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthYearSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export function MonthYearSelector({ selectedDate, onChange }: MonthYearSelectorProps) {
  const handlePreviousMonth = () => {
    onChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onChange(addMonths(selectedDate, 1));
  };

  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
      <button
        onClick={handlePreviousMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-lg font-medium min-w-40 text-center">
        {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      
      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
