"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoriesService } from "@/services/modules/category/category.service";
import {
  Award,
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import SingleTutorCard from "./TutorCard";

interface TutorsListProps {
  tutors: Tutor[];
  isLoading?: boolean;
  onFilterChange?: (filters: Filters) => void;
  onSearch?: (query: string) => void;
  onSortChange?: (sortBy: string) => void;
  onBookClick?: (tutorId: string) => void;
  onSaveClick?: (tutorId: string, saved: boolean) => void;
  savedTutors?: string[];
  showFilters?: boolean;
  layout?: "grid" | "list";
  onLayoutChange?: (layout: "grid" | "list") => void;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy?: string;
  subjects: string[];
  availability: string[];
  languages: string[];
}
// const subject = await categoriesService.getCategories();
// const subjectsList = subject.data.data;

// FilterPanel component moved outside of TutorsList
interface FilterPanelProps {
  filters: Filters;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onResetFilters: () => void;
  onPriceRangeCommit?: (range: [number, number]) => void;
}

const FilterPanel = ({
  filters,
  priceRange,
  onPriceRangeChange,
  onPriceRangeCommit,
  onFilterChange,
  onResetFilters,
}: FilterPanelProps) => {
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  useEffect(() => {
    const loadSubjects = async () => {
      const res = await categoriesService.getCategories();
      setSubjectsList(res.data.data);
    };
    loadSubjects();
  }, []);

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Price Range</Label>
            <span className="text-sm font-medium">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            max={100}
            step={5}
            onValueChange={(value) =>
              onPriceRangeChange(value as [number, number])
            }
            onValueCommit={(value) =>
              onPriceRangeCommit?.(value as [number, number])
            }
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>$50</span>
            <span>$100+</span>
          </div>
        </div>

        <Separator />

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="font-medium">Minimum Rating</Label>
          <div className="flex flex-wrap gap-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <Button
                key={rating}
                variant={filters.minRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange("minRating", rating)}
                className="gap-1"
              >
                <Star className="h-3 w-3" />
                {rating}+
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Subjects */}
        <div className="space-y-3">
          <Label className="font-medium">Subjects</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {subjectsList.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={filters.subjects.includes(item.name)}
                  onCheckedChange={(checked) => {
                    const newSubjects = checked
                      ? [...filters.subjects, item.name]
                      : filters.subjects.filter((s) => s !== item.name);
                    onFilterChange("subjects", newSubjects);
                  }}
                />
                <Label
                  htmlFor={`subject-${item.name}`}
                  className="text-sm cursor-pointer"
                >
                  {item.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TutorsList = ({
  tutors = [],
  isLoading = false,
  onFilterChange,
  onSearch,
  onSortChange,
  onBookClick,
  onSaveClick,
  savedTutors = [],
  showFilters = true,
  layout = "grid",
  onLayoutChange,
}: TutorsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    subjects: [],
    availability: [],
    languages: [],
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const handlePriceRangeCommit = (range: [number, number]) => {
    const newFilters = { ...filters, minPrice: range[0], maxPrice: range[1] };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Reset filters
  const resetFilters = () => {
    const resetFilters = {
      minPrice: 0,
      maxPrice: 100,
      minRating: 0,
      subjects: [],
      availability: [],
      languages: [],
    };
    setFilters(resetFilters);
    setPriceRange([0, 100]);

    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  // Check if tutor is saved
  const isTutorSaved = (tutorId: string) => {
    return savedTutors.includes(tutorId);
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search for different subjects
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Award className="h-3 w-3 mr-2" />
              Find Your Perfect Tutor
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Browse Expert <span className="text-primary">Tutors</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with verified tutors across 50+ subjects. Personalized
              1-on-1 sessions tailored to your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tutors by subject, name, or expertise..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1 h-10"
                  size="sm"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Layout Controls */}
            <div className="flex items-center gap-3">
              {onLayoutChange && (
                <>
                  <Tabs
                    defaultValue="grid"
                    value={layout}
                    onValueChange={(v) => onLayoutChange(v as "grid" | "list")}
                  >
                    <TabsList className="grid w-24 grid-cols-2">
                      <TabsTrigger value="grid">
                        <Grid className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="list">
                        <List className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Separator orientation="vertical" className="h-6" />
                </>
              )}

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {Object.values(filters).some((filter) =>
                  Array.isArray(filter) ? filter.length > 0 : filter > 0,
                ) && <Badge className="ml-2 h-5 w-5 p-0">!</Badge>}
              </Button>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.minRating > 0 ||
            filters.subjects.length > 0 ||
            filters.availability.length > 0 ||
            filters.languages.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  {filters.minRating}+ Rating
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleFilterChange("minRating", 0)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.subjects.map((subject) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() =>
                      handleFilterChange(
                        "subjects",
                        filters.subjects.filter((s) => s !== subject),
                      )
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          {showFilters && (
            <>
              <div className="hidden lg:block lg:w-80">
                <FilterPanel
                  filters={filters}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange} // for live UI
                  onPriceRangeCommit={handlePriceRangeCommit} // final value
                  onFilterChange={handleFilterChange}
                  onResetFilters={resetFilters}
                />
              </div>

              {/* Mobile Filter Panel */}
              {showFilterPanel && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setShowFilterPanel(false)}
                  />
                  <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilterPanel(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <FilterPanel
                      filters={filters}
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      onFilterChange={handleFilterChange}
                      onResetFilters={resetFilters}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tutors Grid */}
          <div className={`flex-1 ${!showFilters ? "lg:col-span-3" : ""}`}>
            {/* Stats */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {tutors.length} Expert Tutors
                  </h2>
                  <p className="text-muted-foreground">
                    Available for personalized 1-on-1 sessions
                  </p>
                </div>
                <Badge variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {tutors.length > 0
                    ? `${Math.round((tutors.filter((t) => t.isOnline).length / tutors.length) * 100)}% Online`
                    : "Loading..."}
                </Badge>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              renderSkeleton()
            ) : tutors.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {/* Tutors Grid/List */}
                <div
                  className={
                    layout === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {tutors.map((tutor) => (
                    <SingleTutorCard
                      key={tutor.id}
                      tutor={tutor}
                      variant={layout === "list" ? "detailed" : "default"}
                      showBookButton={!!onBookClick}
                      showSaveButton={!!onSaveClick}
                      onBookClick={onBookClick}
                      onSaveClick={onSaveClick}
                      saved={isTutorSaved(tutor.id)}
                    />
                  ))}
                </div>

                {/* Pagination Stats */}
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing {tutors.length} of many tutors</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorsList;
export type { Filters, TutorsListProps };
