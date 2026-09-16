import { useTranslations } from "next-intl";
import type { Review } from "@prisma/client";
import { StarRating } from "@/components/StarRating";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import { ReviewHelpfulVote } from "@/components/ReviewHelpfulVote";
import type { ReviewEligibility } from "@/lib/review-eligibility";
import type { Locale } from "@/i18n/routing";

function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-halo/10 px-2 py-0.5 text-[11px] font-medium text-halo">
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </span>
  );
}

export function ReviewsSection({
  productId,
  reviews,
  locale,
  eligibility,
}: {
  productId: string;
  reviews: Review[];
  locale: Locale;
  eligibility: ReviewEligibility;
}) {
  const t = useTranslations("Reviews");
  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section id="reviews" className="mt-16 border-t border-forest/10 pt-10">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-semibold text-forest">{t("title")}</h2>
        {reviews.length > 0 && (
          <>
            <StarRating value={average} />
            <span className="text-sm text-ink/60">
              {average.toFixed(1)} {t("outOfFive")} · {t("basedOnCount", { count: reviews.length })}
            </span>
          </>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-ink/60">
          {eligibility === "can_review" ? t("emptyCanReview") : t("empty")}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-forest/10 bg-cream/40 p-5"
            >
              <StarRating value={review.rating} size="sm" />
              <h3 className="mt-2 font-display text-lg font-semibold text-forest">
                {review.title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-ink/75">{review.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/50">
                <span className="font-medium text-ink/70">{review.customerName}</span>
                {review.verifiedPurchase && (
                  <>
                    <span aria-hidden>·</span>
                    <VerifiedBadge label={t("verifiedPurchase")} />
                  </>
                )}
                <span aria-hidden>·</span>
                <span>{dateFormatter.format(review.createdAt)}</span>
              </div>
              <ReviewHelpfulVote
                reviewId={review.id}
                helpfulCount={review.helpfulCount}
                notHelpfulCount={review.notHelpfulCount}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <WriteReviewForm productId={productId} eligibility={eligibility} />
      </div>
    </section>
  );
}
