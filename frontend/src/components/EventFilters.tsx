
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface EventFiltersProps {
  onSearch?: (filters: { city: string; category: string; date?: Date }) => void;
}

const EventFilters = ({ onSearch }: EventFiltersProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [cityValue, setCityValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("all");
  
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'concerts', label: 'Concerts' },
    { id: 'sports', label: 'Sports' },
    { id: 'arts', label: 'Arts & Theatre' },
    { id: 'family', label: 'Family' },
    { id: 'comedy', label: 'Comedy' },
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        city: cityValue,
        category: categoryValue,
        date: date
      });
    }
  };

  return (
    <div className="bg-white py-6 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="City or location"
                className="pl-10"
                value={cityValue}
                onChange={(e) => setCityValue(e.target.value)}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="w-full md:w-48">
            <Select value={categoryValue} onValueChange={setCategoryValue}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button 
            className="bg-eventPurple hover:bg-eventPurple-dark"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Find Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
