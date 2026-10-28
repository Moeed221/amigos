export default function Reviews() {
  return (
<><section className="section reviews-section" id="reviews">
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow" data-reveal>Word on the street</span>
          <h2 className="h-section" data-reveal style={{'--d': 1}}>Loved by<br />hungry people.</h2>
        </div>
        <div className="right">
          <p className="lede" data-reveal style={{'--d': 2}}>Unedited words from people who ordered, waited, and came back. Reviews are moderated by our team before they appear.</p>
        </div>
      </div>
      <div className="reviews-viewport" data-reveal>
        <div className="reviews-track" id="reviewsTrack" />
      </div>
      <div className="reviews-ctrl">
        <button className="rail-btn" id="revPrev" aria-label="Previous reviews">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
        </button>
        <div className="dots" id="revDots" />
        <button className="rail-btn" id="revNext" aria-label="Next reviews">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
        </button>
      </div>
      <form className="review-form" id="reviewForm" data-reveal>
        <h3 className="h-card" style={{marginBottom: 4}}>Leave a review</h3>
        <div className="row">
          <input name="name" placeholder="Your name" required maxLength={60} />
          <select name="rating" aria-label="Rating">
            <option defaultValue={5}>★★★★★ — Loved it</option>
            <option defaultValue={4}>★★★★ — Good</option>
            <option defaultValue={3}>★★★ — Okay</option>
            <option defaultValue={2}>★★ — Not great</option>
            <option defaultValue={1}>★ — Poor</option>
          </select>
        </div>
        <textarea name="text" placeholder="Tell us what you ordered and how it was…" required maxLength={600} defaultValue={""} />
        <button className="btn btn--red" type="submit"><span>Submit review</span></button>
        <p className="note">Reviews appear after a quick moderation check.</p>
      </form>
    </div>
  </section></>
  );
}
