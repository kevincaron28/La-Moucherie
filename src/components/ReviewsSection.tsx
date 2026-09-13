import { useTranslations } from "next-intl";
import type { Review } from "@prisma/client";
import { StarRating } from "@/components/StarRating";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import type { ReviewEligibility } from "@/lib/review-eligibility";
import type { Locale } from "@/i18n/routing";

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
        <ul className="mt-6 space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-forest/10 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <StarRating value={review.rating} size="sm" />
                <span className="font-display font-semibold text-forest">
                  {review.title}
                </span>
                {review.verifiedPurchase && (
                  <span className="rounded-full bg-halo/10 px-2 py-0.5 text-[11px] font-medium text-halo">
                    {t("verifiedPurchase")}
                  </span>
                )}
              </div>
              <p className="mt-2 text-ink/75">{review.body}</p>
              <p className="mt-2 text-xs text-ink/45">
                {review.customerName} · {dateFormatter.format(review.createdAt)}
              </p>
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
