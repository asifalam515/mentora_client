"use client";

import { categoriesService } from "@/services/modules/category/category.service";
import { tutorService } from "@/services/tutor.service";
import { useEffect, useState } from "react";
import TutorsList, { Filters } from "./TutorsList";

const TutorsContainer = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(
    new Map(),
  );

  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    subjects: [],
    availability: [],
    languages: [],
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Load categories map once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesService.getCategories();
        const cats = res.data.data;
        const map = new Map();
        cats.forEach((cat: any) => map.set(cat.name, cat.id));
        setCategoriesMap(map);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  // Fetch tutors with current filters and page
  const fetchTutors = async (page: number = currentPage) => {
    try {
      setLoading(true);

      const categoryIds = filters.subjects
        .map((name) => categoriesMap.get(name))
        .filter((id): id is string => !!id);

      const params: any = {
        search,
        sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        page,
        limit: 10, // or whatever limit you use
      };

      if (categoryIds.length > 0) {
        params.categoryIds = categoryIds;
      }

      const { data } = await tutorService.getTutors(params);
      setTutors(data.tutors);
      setPagination(data.pagination); // save pagination info
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re‑fetch when filters, search, or sort change (reset to page 1)
  useEffect(() => {
    if (categoriesMap.size > 0) {
      setCurrentPage(1);
      fetchTutors(1);
    }
  }, [filters, search, sortBy, categoriesMap]);

  // Manual page change handler
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    fetchTutors(newPage);
  };

  return (
    <TutorsList
      tutors={tutors}
      isLoading={loading}
      onFilterChange={setFilters}
      onSearch={setSearch}
      onSortChange={setSortBy}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  );
};

export default TutorsContainer;
