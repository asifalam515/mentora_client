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

  // Load all categories once to map names → IDs
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

  const fetchTutors = async () => {
    try {
      setLoading(true);

      // Convert subject names to category IDs
      const categoryIds = filters.subjects
        .map((name) => categoriesMap.get(name))
        .filter((id) => id !== undefined) as string[];

      const params: any = {
        search,
        sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
      };

      // Only add categoryIds if we have any
      if (categoryIds.length > 0) {
        params.categoryIds = categoryIds;
      }

      const { data } = await tutorService.getTutors(params);
      setTutors(data.tutors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re‑fetch whenever filters, search, sortBy change AND categories map is ready
  useEffect(() => {
    if (categoriesMap.size > 0) {
      fetchTutors();
    }
  }, [filters, search, sortBy, categoriesMap]);

  return (
    <TutorsList
      tutors={tutors}
      isLoading={loading}
      onFilterChange={setFilters}
      onSearch={setSearch}
      onSortChange={setSortBy}
    />
  );
};

export default TutorsContainer;
