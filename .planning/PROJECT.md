# Tarot Foundations Landing Page

## What This Is

A mobile-first landing page for Dr. Anchal Rana Aggarwal's ₹599 Tarot Foundation Course. It explains the course's connected approach to tarot cards, planets, astrology, and timing, and helps prospective learners decide whether the course is right for them.

## Core Value

Visitors should understand what the course offers and feel confident making an informed decision without relying on fabricated outcomes or social proof.

## Business Context

- **Customer**: People who want a structured foundation in tarot and related astrology.
- **Revenue model**: One-time course purchase listed at ₹599.
- **Success metric**: More informed course enquiries and checkout visits; checkout conversion tracking is not currently present in the page.

## Requirements

### Validated

- ✓ The landing page presents a four-part learning system: cards, planets, astrology, and timing.
- ✓ The course price is listed as ₹599.
- ✓ Dr. Anchal Rana Aggarwal's 10 years of experience is approved for publication.
- ✓ Existing student testimonial videos are approved for publication.

### Active

- [ ] Present course details and mentor experience clearly and credibly.
- [ ] Display the approved student videos in a continuous, responsive carousel.
- [ ] Keep mobile layouts and animations usable, including for reduced-motion preferences.
- [ ] Keep purchase calls to action linked to the on-page pricing section until a checkout URL is supplied.

### Out of Scope

- Student counts, star ratings, limited-time claims, or outcome guarantees without evidence.
- A new payment integration; no external checkout URL has been provided.
- New testimonial quotes or student names not provided by the course owner.

## Context

- The project is a static HTML, CSS, and vanilla JavaScript site with no package manifest.
- Existing testimonial videos and poster images are stored in `testimonial-videos/`.
- The existing CTA currently navigates to the on-page pricing section.
- Existing worktree edits and untracked brand assets predate this task and must be preserved.

## Constraints

- **Compatibility**: Keep the site dependency-free and compatible with the current static hosting setup.
- **Accessibility**: Respect `prefers-reduced-motion`; keep real video controls accessible and pause motion during keyboard focus or video playback.
- **Content accuracy**: Use only course-owner-confirmed claims and approved media.
- **Mobile performance**: Reduce decorative animation load on narrow viewports.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use the existing testimonial videos without invented quotes or star ratings | Student media is approved; no rating or quote evidence was supplied | — Pending |
| Keep CTA links on the pricing section | The user selected this while checkout URL is unavailable | — Pending |
| Use CSS motion with a reduced-motion/static-scroll fallback | Preserves the continuous carousel while respecting accessibility preferences | — Pending |

---
*Last updated: 2026-10-29 after landing-page trust and mobile-carousel scope was confirmed*
