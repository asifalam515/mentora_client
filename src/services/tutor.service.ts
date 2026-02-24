interface GetBlogParam {
  isFeatured: boolean;
  search: string;
}
export const tutorService = {
  getTutors: async function (params?: GetBlogParam) {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/tutor-profiles`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const res = await fetch(url.toString());

      const data = await res.json();
      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: "something went wrong" };
    }
  },
  getTutorDetails: async function (tutorId: string) {
    try {
      if (!tutorId) {
        return { data: null, error: "Tutor ID is required" };
      }

      const url = new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tutor-profiles/${tutorId}`,
      );

      const res = await fetch(url.toString());

      if (!res.ok) {
        if (res.status === 404) {
          return { data: null, error: "Tutor not found" };
        }
        return {
          data: null,
          error: `Failed to fetch tutor details: ${res.status}`,
        };
      }

      const data = await res.json();
      return { data: data, error: null };
    } catch (error) {
      console.error("Error fetching tutor details:", error);
      return {
        data: null,
        error: "Something went wrong. Please try again later.",
      };
    }
  },
};
