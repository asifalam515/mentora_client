interface GetBlogParam {
  isFeatured: boolean;
  search: string;
}
export const tutorService = {
  getTutors: async (params?: any) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const url = new URL(`${baseUrl}/tutor-profiles`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return;
          }

          if (Array.isArray(value)) {
            value.forEach((v) => {
              url.searchParams.append(key, String(v));
            });
          } else {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch tutors");
      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      console.error("Tutor fetch error:", error);
      return { data: null, error: "Something went wrong" };
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
