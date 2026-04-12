"use client";

import { useSmartMatch } from "@/hooks/useSmartMatch";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import "./SmartMatch.css";

export function SmartMatch() {
  const [goal, setGoal] = useState("");
  const { matches, loading, error, findMatches } = useSmartMatch();
  const router = useRouter();

  const getDisplayTutorName = (tutorId: string) => {
    const normalized = tutorId.replace(/[_-]/g, " ").trim();
    return normalized
      .replace(/\s+#/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/^tutor\s*/i, "Tutor ")
      .trim();
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "TU";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const goToTutorProfile = (
    tutorId: string,
    fallbackId: string,
    profileUrl?: string,
  ) => {
    if (profileUrl) {
      router.push(profileUrl);
      return;
    }

    if (tutorId) {
      router.push(`/tutors/${encodeURIComponent(tutorId)}`);
      return;
    }
    router.push(`/tutors?recommended=${encodeURIComponent(fallbackId)}`);
  };

  const getCategoryName = (category: { name?: string; title?: string }) =>
    category.name || category.title || "General";

  const getReviewCount = (reviews?: Array<unknown>) => reviews?.length ?? 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await findMatches(goal);
  };

  const handleBooking = (tutorId: string, tutorName: string) => {
    // Navigate to tutor details or booking page
    console.log(`Booking session with ${tutorName} (${tutorId})`);
    router.push(`/tutors/${tutorId}`);
  };

  return (
    <div className="smart-match-container">
      <div className="smart-match-hero">
        <h1>🎓 Find Your Perfect Tutor</h1>
        <p>
          Tell us what you want to learn, and our AI will recommend the best
          tutors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="smart-match-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="E.g., I want to learn TypeScript for backend development"
            className="goal-input"
            disabled={loading}
            maxLength={200}
          />
          <button
            type="submit"
            className="search-button"
            disabled={loading || !goal.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Finding tutors...
              </>
            ) : (
              <>🔍 Find Tutors</>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </form>

      {matches.length > 0 && (
        <section className="matches-section">
          <h2>Top Matches for &quot;{goal}&quot;</h2>
          <div className="matches-grid">
            {matches.map((match, index) => (
              <div
                key={match.tutorId}
                className={`tutor-card rank-${index + 1}`}
              >
                <div className="card-header">
                  <span className="rank">#{index + 1}</span>
                  <span className="match-score">{match.matchScore}% Match</span>
                </div>

                <div className="tutor-profile">
                  {match.tutor?.user?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={match.tutor.user.image}
                      alt={match.tutor.user.name}
                      className="tutor-image"
                    />
                  )}
                  {!match.tutor?.user?.image && (
                    <div className="tutor-image-placeholder" aria-hidden="true">
                      {getInitials(
                        match.tutor?.user?.name ??
                          getDisplayTutorName(match.tutorId),
                      )}
                    </div>
                  )}
                  <div className="tutor-info">
                    <h3>
                      {match.tutor?.user?.name ??
                        getDisplayTutorName(match.tutorId)}
                    </h3>
                    {match.tutor?.isVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                    {match.tutor?.user?.email && (
                      <p>{match.tutor.user.email}</p>
                    )}
                  </div>
                </div>

                {match.tutor?.bio && (
                  <p className="tutor-bio">{match.tutor.bio}</p>
                )}

                <div className="reason-box">
                  <strong>Why this match:</strong>
                  <p>{match.reason}</p>
                  {match.matchRationale && <p>{match.matchRationale}</p>}
                </div>

                {match.tutor && (
                  <>
                    <div className="skills">
                      {match.tutor.categories.map((cat, catIndex) => (
                        <span
                          key={cat.id ?? `${match.tutorId}-${catIndex}`}
                          className="skill-badge"
                        >
                          {getCategoryName(cat)}
                        </span>
                      ))}
                    </div>

                    <div className="stats">
                      <div className="stat">
                        <span className="label">Rating</span>
                        <span className="value">⭐ {match.tutor.rating}/5</span>
                      </div>
                      <div className="stat">
                        <span className="label">Experience</span>
                        <span className="value">{match.tutor.experience}y</span>
                      </div>
                      <div className="stat">
                        <span className="label">Price</span>
                        <span className="value">
                          ${match.tutor.pricePerHr}/hr
                        </span>
                      </div>
                      <div className="stat">
                        <span className="label">Reviews</span>
                        <span className="value">
                          {getReviewCount(match.tutor.reviews)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="card-actions">
                  <button
                    onClick={() =>
                      goToTutorProfile(
                        match.tutor?.id ?? "",
                        match.tutorId,
                        match.profileUrl,
                      )
                    }
                    className="profile-button"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      if (!match.tutor) return;
                      handleBooking(match.tutor.id, match.tutor.user.name);
                    }}
                    className="book-button"
                    disabled={!match.tutor}
                    title={
                      !match.tutor ? "Detailed profile is loading" : undefined
                    }
                  >
                    📅 Book Trial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && matches.length === 0 && goal && !error && (
        <div className="no-results">
          <p>No matches found. Try adjusting your search goal.</p>
        </div>
      )}
    </div>
  );
}
