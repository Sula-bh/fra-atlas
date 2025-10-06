import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SearchBarProps {
  onSearch?: (query: string, filter: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim() && filterType === 'all') {
      toast.info('Please enter a search term or select a filter');
      return;
    }
    
    setIsSearchActive(true);
    onSearch?.(searchQuery, filterType);
    
    const filterLabel = {
      all: 'All Rights',
      ifr: 'Individual (IFR)',
      cr: 'Community (CR)',
      cfr: 'CFR Rights'
    }[filterType];
    
    toast.success(`Searching for: ${searchQuery || filterLabel}`);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilterType('all');
    setIsSearchActive(false);
    onSearch?.('', 'all');
    toast.info('Search cleared');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by village, district, or claim ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-[1001]">
              <SelectItem value="all">All Rights</SelectItem>
              <SelectItem value="ifr">Individual (IFR)</SelectItem>
              <SelectItem value="cr">Community (CR)</SelectItem>
              <SelectItem value="cfr">CFR Rights</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" onClick={handleSearch}>
            Search
          </Button>
          {isSearchActive && (
            <Button variant="outline" size="icon" onClick={handleClear}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isSearchActive && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => {
                  setSearchQuery('');
                  onSearch?.('' , filterType);
                }}
              />
            </Badge>
          )}
          {filterType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filterType.toUpperCase()}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => {
                  setFilterType('all');
                  onSearch?.(searchQuery, 'all');
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
