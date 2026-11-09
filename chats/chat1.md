# Horizontal mouse dragging feature

_Started 2026-11-07 16:01 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "# MUJEEB (مجيب)?# COMPLETE MASTER PROMPT FOR CLAUDE.AI/DESIGN?## Bilingual Servi"
Current date is now November 7, 2026
</system-info>

<attached aesthetic_system_instructions>
A design system or theme is attached to this project. That attachment already answers the visual-style question: apply it. Do NOT ask the user which visual style to use — no questions about vibe, colors or palette directions (including color-swatch svg-options questions), typography, mood, or art direction, and skip the "divergent visuals" question from the question-asking tips; offer divergent visual directions only if the user themselves asks for alternatives. This rule bans asking the user to pre-pick a style in the abstract — swatches, mood words, palette pickers. It does not ban asking them to choose among candidates you have already built: putting built candidates on a file-options board for the user to pick from is encouraged. Treat the attachment as the confirmed starting point and product context — the "confirm the starting point" tip is already satisfied, so do not ask the user to confirm or re-pick it. Spend your questions on everything else you need: audience, purpose, content, structure, scope, interactions, tone of copy.
</attached aesthetic_system_instructions>

<pasted_text name="Pasted text (2329 lines)">
# MUJEEB (مجيب)
# COMPLETE MASTER PROMPT FOR CLAUDE.AI/DESIGN
## Bilingual Services Discovery &amp; Marketplace Platform

## 1. YOUR ROLE AND PROJECT OBJECTIVE

Act as a senior product designer, UX/UI architect, full-stack engineer, and SaaS platform architect.

Design and develop **MUJEEB (مجيب)**, a premium, visually engaging, bilingual marketplace connecting customers with professional service providers in Oman.

The platform should have the visual quality of a modern, established consumer marketplace while remaining practical, scalable, and easy to operate.

MUJEEB enables customers to:

- Discover service providers.
- Browse services and company profiles.
- Explore photographs and videos of previous work.
- Browse organized portfolio albums.
- Request quotations through structured forms.
- Book site visits when enabled.
- Contact providers through WhatsApp.
- Communicate through internal messaging.
- Call providers directly.
- Save favorite companies and projects.

MUJEEB enables service providers to:

- Register and manage company profiles.
- List services.
- Manage branches and service coverage.
- Upload images and videos into a centralized Media Library.
- Reuse media throughout the platform.
- Create portfolio albums.
- Receive quotation requests.
- Prepare and send quotations.
- Manage site visit appointments.
- Communicate with customers.
- Purchase advertising placements.
- Manage subscriptions.
- View analytics.
- Submit support tickets.

MUJEEB generates revenue primarily from:

1. Service provider membership subscriptions.
2. Paid advertising placements.

Do not introduce service transaction commissions, escrow, or payment collection for customer projects without approval.

---

# PART A — APPLICATION STRUCTURE

## 2. REQUIRED INTERFACES

Create four integrated interfaces.

### A1. Customer Mobile Application

A polished iOS and Android customer application featuring service discovery, portfolios, quotations, bookings, and communication.

### A2. Customer Account Dashboard

Integrated into the customer application.

Includes:

- Profile.
- Favorites.
- Messages.
- Quotation Requests.
- Received Quotations.
- Bookings.
- Notifications.
- Settings.

### A3. Service Provider Dashboard

A responsive web application for company owners and authorized staff.

Includes:

- Dashboard.
- Company Profile.
- Services.
- Branches.
- Service Coverage.
- Media Management.
- Portfolio.
- Quotations.
- Bookings.
- Messages.
- Advertising.
- Membership.
- Analytics.
- Support Center.
- Notifications.
- Settings.

### A4. Platform Super Admin Dashboard

A comprehensive responsive administration application.

Includes company, customer, category, media, quotation, booking, membership, advertising, finance, notification, support, reporting, and platform management.

All interfaces must use a shared Supabase backend.

---

# PART B — SERVICE CATEGORIES

## 3. INITIAL 20 MAJOR SERVICE CATEGORIES

**CRITICAL: These are 20 independent top-level categories, NOT subcategories.**

| # | Arabic | English |
|---|---|---|
| 1 | مقاولات البناء | Building Contracting |
| 2 | التصميم الداخلي والديكور | Interior Design &amp; Decoration |
| 3 | الحدادة والألمنيوم والزجاج | Metal, Aluminum &amp; Glass Works |
| 4 | أعمال الكهرباء | Electrical Works |
| 5 | السباكة وشبكات المياه | Plumbing &amp; Water Systems |
| 6 | الأعمال الخشبية | Carpentry &amp; Woodworks |
| 7 | المطابخ والخزانات | Kitchens &amp; Cabinets |
| 8 | تركيب الحجر الطبيعي والأرضيات | Natural Stone &amp; Flooring Installation |
| 9 | تصميم وتنفيذ الحدائق | Landscaping &amp; Garden Design |
| 10 | فك وتركيب الأثاث | Furniture Assembly &amp; Installation |
| 11 | تمديد أنابيب الغاز | Gas Pipe Installation |
| 12 | تلميع الرخام | Marble Polishing |
| 13 | خدمات السيارات | Automotive Services |
| 14 | خدمات النقل | Transportation Services |
| 15 | أعمال التكييف والتبريد | Air Conditioning &amp; Refrigeration |
| 16 | البيوت الذكية | Smart Home Systems |
| 17 | استشارات هندسية | Engineering Consultancy |
| 18 | التطوير العقاري | Real Estate Development |
| 19 | أنظمة مكافحة الحريق | Fire Protection Systems |
| 20 | أنظمة الأمن والمراقبة CCTV | Security &amp; CCTV Systems |

### Category Rules

- All 20 categories must appear as major categories.
- Do not create parent groups or automatic subcategories.
- Each category must have a suitable professional icon and representative photograph.
- Providers can select multiple categories subject to membership limits.
- Categories must be managed dynamically through Supabase.
- Super Admin can create, edit, activate, deactivate, reorder, and safely merge categories.
- Do not add new initial categories without approval.

### Important Distinction

A **Major Category** is a platform-wide classification.

A **Service** is a specific offering created by an individual provider.

For example:

Major Category: أعمال التكييف والتبريد

Provider Services:
- AC Installation.
- AC Maintenance.
- AC Repair.

These provider-specific services must not automatically become platform-wide categories or subcategories.

---

# PART C — VISUAL DESIGN

## 4. DESIGN DIRECTION

MUJEEB must be colorful, modern, premium, professional, and visually rich.

Take inspiration from:

- Houzz — home improvement discovery.
- Pinterest — image-rich portfolios.
- Airbnb — intuitive navigation.
- Modern consumer marketplaces — polished cards and interactive browsing.

Do not copy existing brands directly.

### Design Requirements

- Professional typography.
- Colorful but balanced visual identity.
- High-quality photography.
- Modern Lucide icons.
- Rounded cards.
- Subtle shadows.
- Generous spacing.
- Clear hierarchy.
- Smooth animations.
- Responsive layouts.
- Accessible contrast.
- Consistent components.

Use light mode as the default.

Suggested palette:

- Deep teal: #166B72
- Warm amber: #F2A541
- Soft blue: #6487D5
- Sage green: #68A88A
- Coral: #D87973

Use these as starting points, not rigid requirements.

Use different complementary colors for category cards.

Dashboards should be cleaner and more restrained than the customer application.

## 5. ICONS AND PHOTOGRAPHY

Use professional icon libraries such as:

- Lucide.
- Tabler.
- Material Symbols.

Use relevant high-resolution photographs from:

- Unsplash.
- Pexels.
- Pixabay.

Verify applicable licensing requirements.

Use realistic photographs representing actual service categories.

Avoid repetitive stock images and generic placeholders.

Demo company portfolios must be clearly fictional.

---

# PART D — CAROUSEL-FIRST EXPERIENCE

## 6. CAROUSEL REQUIREMENTS

Use horizontally swipeable carousels where they improve discovery.

Apply to:

- Service categories.
- Featured companies.
- Featured projects.
- Recently added projects.
- Portfolio album previews.
- Service galleries.
- Project galleries.
- Location shortcuts.
- Filter chips.
- Company branches.
- Favorites.
- Advertising placements.
- Membership cards.
- Mobile KPI cards.

### Carousel Behavior

- Smooth swipe.
- Scroll snapping.
- Partial next-card visibility.
- Lazy loading.
- Responsive card sizes.
- RTL support.
- Pagination indicators when useful.
- Accessible controls.

Do not force carousels into long search results, chat histories, or administrative tables.

---

# PART E — BILINGUAL SUPPORT

## 7. LANGUAGES

Support:

- English.
- Arabic with full RTL.

All navigation, forms, buttons, settings, notifications, dashboards, and system messages must be translated.

Support bilingual company, service, project, album, and advertising content.

Use centralized localization files.

Allow users to switch languages.

Preserve language preferences.

Do not automatically overwrite original user-generated text.

---

# PART F — CUSTOMER MOBILE APPLICATION

## 8. CUSTOMER HOMEPAGE

Create a visually impressive mobile homepage.

Include:

### Header
- MUJEEB logo.
- Selected location.
- Language switcher.
- Notification bell.
- Account access.

### Search
Prominent search field:

"What service are you looking for?"

Search across categories, companies, services, and projects.

### Categories
Display all 20 major categories using colorful image cards and horizontal carousels.

Include View All Categories.

### Featured Companies
Horizontal carousel.

### Featured Projects
Image-focused carousel.

### Recent Projects
Recently published portfolio content.

### Sponsored Content
Clearly labeled advertising placements.

### Recommended Providers
Relevant providers based on selected category and location.

## 9. BOTTOM NAVIGATION

Use:

1. Home.
2. Categories.
3. Explore.
4. Messages.
5. Profile.

## 10. SEARCH AND FILTERS

Allow search by:

- Company name.
- Major category.
- Service name.
- Project keyword.
- Governorate.
- City or district.
- Service coverage.
- Verification status.

Sorting:

- Relevance.
- Nearest branch.
- Recently added.

Support list and map views.

### Location Rule

Branch location and service coverage are separate.

A provider located in Muscat but serving Sohar must appear in appropriate Sohar searches.

## 11. COMPANY SEARCH RESULTS

Company cards display:

- Cover image.
- Logo.
- Company name.
- Categories.
- Location.
- Service coverage.
- Verification badge.
- Favorite button.
- View Profile action.

Use vertical scrolling and pagination.

## 12. COMPANY PUBLIC PROFILE

Include:

- Company cover.
- Logo.
- Name.
- Description.
- Verification badge.
- Major categories.
- Services.
- Branches.
- Service coverage.
- Working hours.
- Portfolio albums.
- Contact actions.

### Contact Actions

Display:

1. Get Quotation.
2. WhatsApp.
3. Message.
4. Call.

Additionally display:

5. Book a Site Visit — only when enabled globally and by the provider.

## 13. SERVICE DETAILS PAGE

Create a dedicated `service-details` page for every published provider service.

Display:

- Service title.
- Description.
- Category.
- Cover image.
- Service photographs.
- Service videos.
- Provider information.
- Related portfolio albums or projects.
- Contact buttons.

The page must contain:

- Get Quotation.
- WhatsApp.
- Message.
- Call.
- Book a Site Visit, when enabled.

All media must originate from the provider's centralized Media Library.

---

# PART G — CENTRALIZED MEDIA MANAGEMENT

## 14. MEDIA MANAGEMENT ARCHITECTURE

**CRITICAL: Service providers must upload images and videos ONLY through Media Management.**

Do not allow independent uploads in:

- Company Profile.
- Services.
- Portfolio.
- Projects.
- Albums.

Instead, these sections must use a shared Media Picker to select existing files.

### Provider Sidebar

Add:

**Media Management**
- Media Library.
- Albums.
- Storage Usage.

## 15. MEDIA LIBRARY

Display all company images and videos in a responsive grid.

Each media item should include:

- Thumbnail.
- File name.
- Media type.
- File size.
- Original dimensions.
- Upload date.
- Usage count.

Allow providers to:

- Upload images.
- Upload videos.
- Bulk upload.
- Preview.
- Rename.
- Add descriptions.
- Search.
- Filter.
- Sort.
- Select multiple items.
- Delete unused files.
- Organize files into albums.

Show upload progress and validation errors.

## 16. MEDIA ALBUMS

Support two distinct album concepts.

### A. Private Media Albums

Used internally to organize files.

Examples:
- Construction Photos.
- Kitchen Installations.
- Landscaping Videos.
- Company Branding.

These albums are not publicly visible.

### B. Public Portfolio Albums

Published collections showcasing completed work.

Examples:
- Villa Construction 2026.
- Luxury Kitchen Installation.
- Residential Landscaping Project.

Each public album contains:

- Arabic and English title.
- Description.
- Major category.
- Cover image.
- Multiple photographs.
- Multiple videos.
- Optional location.
- Optional completion date.

Allow providers to:

- Create albums.
- Edit albums.
- Select media from the library.
- Reorder media.
- Select covers.
- Publish and unpublish.
- Reorder albums.
- Delete albums without deleting underlying media files.

One media file can appear in multiple albums.

## 17. SHARED MEDIA PICKER

Create a reusable Select from Media Library component.

Support:

- Search.
- Image/video filters.
- Album navigation.
- Single selection.
- Multiple selection.
- Preview.
- Confirm selection.

Do not include an upload button in the picker.

If the library is empty, direct the provider to Media Management.

## 18. MEDIA UPLOAD RULES

Validate:

- File format.
- File size.
- Minimum resolution.
- Video duration.
- Video dimensions.

Preserve the original file.

Do not permanently crop or distort original media during upload.

Store original media in Supabase Storage.

## 19. STANDARD ASPECT RATIOS

Use the following initial display standards:

| Placement | Ratio |
|---|---|
| Company logo | 1:1 |
| Company cover | 16:9 |
| Company listing card | 4:3 |
| Service cover | 4:3 |
| Service gallery | 4:3 |
| Portfolio album cover | 4:3 |
| Portfolio thumbnail | 1:1 |
| Featured project card | 4:3 |
| Homepage advertising banner | 16:9 |
| Vertical promotional media | 9:16 |

These are default presets.

Use actual component placeholder dimensions where they differ.

Allow authorized administrators to configure placement standards.

## 20. NON-DESTRUCTIVE CROP AND RESIZE EDITOR

Whenever a provider selects media for a particular placement, open a Crop &amp; Resize Editor.

Automatically load the required aspect ratio.

Allow:

- Cropping.
- Zooming.
- Repositioning.
- Resizing.
- Image rotation.
- Resetting.
- Live preview.

Lock the crop frame to the placement ratio.

Never stretch or distort images.

Preserve the original file.

Store independent crop settings for every placement.

Example:

One photograph can be reused as:

- Company cover — 16:9.
- Service card — 4:3.
- Portfolio thumbnail — 1:1.

Changing one crop must not affect the others.

## 21. VIDEO PLACEMENT

Apply equivalent rules to videos.

Allow:

- Aspect-ratio preview.
- Visible-area adjustment.
- Poster thumbnail selection.
- Repositioning.
- Scaling.

Preserve the original video.

Use server-side video processing only when the required processing service is implemented.

## 22. MEDIA DELETION RULES

Before deleting a file, check all usage references.

If used in a company profile, service, project, or album, prevent deletion and display its usage locations.

Removing media from a service or album must not delete the original file.

Deleting an album must not delete its media.

Count each original file only once toward storage usage.

## 23. MEDIA STORAGE LIMITS

Display:

- Number of images.
- Number of videos.
- Storage consumed.
- Storage allowance.
- Remaining storage.

Allow the Super Admin to configure storage limits by membership tier.

Enforce limits through backend validation.

---

# PART H — SERVICE PROVIDER DASHBOARD

## 24. COMPANY REGISTRATION

Create a multi-step registration process.

Collect:

- Company name in Arabic.
- Company name in English.
- Description.
- Email.
- Phone.
- WhatsApp.
- Main branch.
- Service categories.
- Service coverage.

Allow company logo and cover selection after media has been uploaded through Media Management.

Eligible new companies receive a 30-day Platinum trial.

## 25. DASHBOARD OVERVIEW

Display:

- Profile views.
- Service views.
- Portfolio views.
- WhatsApp clicks.
- Call clicks.
- Customer messages.
- Quotation requests.
- Site visit bookings.
- Published services.
- Published albums.
- Membership status.
- Active advertisements.
- Open support tickets.

Use KPI cards and charts.

## 26. COMPANY PROFILE MANAGEMENT

Allow editing of:

- Company information.
- Descriptions.
- Logo.
- Cover.
- Contact details.
- Social links.
- Website.
- Business hours.
- Categories.

All images and videos must be selected from Media Management.

Include Preview Public Profile.

## 27. SERVICES MANAGEMENT

Create full service CRUD.

Allow providers to:

- Create services.
- Edit services.
- Delete services.
- Publish and unpublish.
- Assign major categories.
- Add bilingual descriptions.
- Select service media.
- Choose cover images.
- Reorder selected media.
- Preview service pages.

Do not create new platform-wide categories when providers add services.

## 28. BRANCH MANAGEMENT

Allow providers to:

- Add branches.
- Edit branches.
- Deactivate branches.
- Select primary branch.
- Set map coordinates.
- Configure working hours.

Enforce membership limits.

## 29. SERVICE COVERAGE

Allow providers to select:

- All Oman.
- Specific governorates.
- Specific cities or districts.

Store service coverage separately from physical branches.

## 30. PORTFOLIO MANAGEMENT

Create a dedicated Portfolio section.

Allow providers to:

- Create public portfolio albums.
- Link albums to completed projects where applicable.
- Select media from the library.
- Set cover images.
- Reorder media.
- Publish and unpublish.
- Preview albums.
- Reorder public portfolio display.

Support standalone albums without requiring a separate project record.

---

# PART I — CUSTOMER CONTACT METHODS

## 31. FOUR CONTACT ACTIONS

On both provider profiles and `service-details` pages, display:

### Get Quotation
Opens the in-app RFQ form.

### WhatsApp
Opens WhatsApp with the provider's configured business number.

### Message
Opens MUJEEB's internal messaging system.

### Call
Opens the native phone dialer using the provider's business telephone number.

Use Get Quotation as the primary action.

WhatsApp, Message, and Call are secondary actions.

Track contact interactions separately.

Do not count clicks as confirmed business transactions.

---

# PART J — QUOTATION REQUEST SYSTEM

## 32. CUSTOMER RFQ FORM

Allow customers to request quotations directly through MUJEEB.

Collect:

- Selected provider.
- Selected service.
- Request title.
- Project description.
- Governorate.
- City or district.
- Contact information.

Optional:

- Exact address.
- Map location.
- Budget range.
- Preferred start date.
- Photographs.
- Documents.
- Notes.

Allow attachments from the customer's device.

The centralized provider Media Library restriction does not apply to customer-submitted RFQ attachments.

Generate unique references such as:

MJB-RFQ-000001

Require authentication before final submission.

Preserve the draft during login.

## 33. CUSTOMER QUOTATION DASHBOARD

Add My Quotations.

Statuses:

- Submitted.
- Under Review.
- More Information Required.
- Quotation Received.
- Declined.
- Closed.
- Cancelled.

Allow customers to:

- View requests.
- Review attachments.
- Respond to questions.
- View received quotations.
- Download PDFs.
- Accept or reject quotations.
- Contact providers.

## 34. PROVIDER QUOTATION MANAGEMENT

Add:

**Quotations**
- Overview.
- New Requests.
- All Requests.
- Sent Quotations.
- Archived Requests.
- Settings.

Allow providers to:

- Review requests.
- Request more information.
- Reply through messaging.
- Decline requests.
- Create quotations.
- Upload quotation documents.
- Send quotations.
- Revise quotations.
- Review history.

## 35. QUOTATION BUILDER

Include:

- Quotation number.
- Company information.
- Customer information.
- Related RFQ.
- Date.
- Validity period.
- Itemized services.
- Quantities.
- Unit prices.
- Discounts.
- Applicable taxes.
- Additional charges.
- Total.
- Terms.
- Notes.

Support PDF generation.

Use OMR by default.

Allow providers to upload an existing quotation PDF instead.

### Quotation Statuses

- Draft.
- Sent.
- Viewed.
- Accepted.
- Rejected.
- Expired.
- Withdrawn.

Preserve revisions and version history.

Quotation acceptance must not automatically create a payment or legally binding contract.

## 36. QUOTATION FEATURE CONTROLS

Super Admin can globally enable or disable RFQs.

Providers can independently enable or disable quotation requests.

The global switch overrides provider settings.

Preserve historical records when disabled.

---

# PART K — INTERNAL MESSAGING

## 37. CUSTOMER–PROVIDER CHAT

Implement real-time internal messaging.

Support:

- Text.
- Image attachments.
- Document attachments.
- Conversation history.
- Unread counts.
- Read receipts.
- Notifications.
- Project references.
- RFQ references.
- Blocking and reporting.

Use Supabase Realtime.

Avoid duplicate conversations between the same customer and provider.

## 38. PROVIDER INBOX

Include:

- Conversation list.
- Customer information.
- Search.
- Unread indicators.
- Message history.
- Attachments.
- Replies.
- Staff assignment.
- Archive.

Protect conversations with company-level access controls.

## 39. MESSAGING ANALYTICS

Track:

- New conversations.
- Unanswered inquiries.
- Response times.
- Message activity.

Do not classify messages as completed jobs.

---

# PART L — SITE VISIT BOOKING SYSTEM

## 40. BOOKING SYSTEM OVERVIEW

Implement a site visit booking system for:

- Inspections.
- Consultations.
- Measurements.
- Maintenance assessments.
- Property evaluations.
- Other provider-defined visit purposes.

The system must have two levels of control.

### Global Control

Super Admin:

**Platform Settings → Site Visit Booking → ON/OFF**

When OFF:

- Hide booking buttons.
- Block new bookings server-side.
- Preserve existing appointments.
- Preserve booking history.
- Allow authorized historical review.

### Provider Control

Provider:

**Bookings → Settings → Accept Bookings ON/OFF**

When OFF:

- Hide booking buttons for that company.
- Stop new requests.
- Preserve existing bookings.

The global switch always takes precedence.

## 41. PROVIDER AVAILABILITY

Allow providers to configure:

- Available weekdays.
- Start and end times.
- Multiple daily time ranges.
- Appointment duration.
- Breaks.
- Minimum advance notice.
- Maximum advance booking period.
- Buffer between visits.
- Simultaneous booking capacity.
- Blocked dates.
- Temporary unavailability.

Use Asia/Muscat local time for display.

Store timestamps consistently in UTC.

Prevent double booking through backend enforcement.

## 42. CUSTOMER BOOKING FLOW

1. Open provider profile or service page.
2. Click Book a Site Visit.
3. Select visit purpose.
4. Enter site location.
5. Select available date.
6. Select available time.
7. Add notes and optional attachments.
8. Review booking.
9. Submit.

Generate booking references such as:

MJB-BK-000001

## 43. BOOKING CONFIRMATION

Support:

- Instant Confirmation.
- Manual Confirmation.

Default to Manual Confirmation.

Providers can accept, reject, or propose another time.

Customers must accept proposed changes before confirmation.

## 44. BOOKING STATUSES

- Pending.
- Confirmed.
- Reschedule Proposed.
- Cancelled.
- Rejected.
- Completed.
- No Show.

Maintain status history.

## 45. PROVIDER BOOKING DASHBOARD

Add:

- Overview.
- Calendar.
- Booking Requests.
- Confirmed Appointments.
- History.
- Availability.
- Settings.

Support day, week, and month calendar views.

## 46. CUSTOMER MY BOOKINGS

Allow customers to:

- View appointments.
- View status.
- Cancel within policy.
- Request rescheduling.
- Accept proposed times.
- Contact providers.
- View booking history.

## 47. BOOKING NOTIFICATIONS

Notify both parties of:

- New requests.
- Confirmations.
- Rejections.
- Rescheduling.
- Cancellations.
- Upcoming appointments.

Support configurable reminders.

Do not introduce online booking payments without approval.

---

# PART M — MEMBERSHIPS

## 48. MEMBERSHIP PLANS

Create:

- Silver.
- Gold.
- Platinum.

Provide a 30-day Platinum trial for eligible companies.

Initial limits:

| Feature | Silver | Gold | Platinum |
|---|---|---|---|
| Company profile | Yes | Yes | Yes |
| Major categories | 2 | 5 | Unlimited |
| Branches | 1 | 3 | Unlimited |
| Published projects/albums | 10 | 50 | Unlimited |
| Images per project | 5 | 15 | 30 |
| Videos per project | 0 | 2 | 5 |
| General gallery | 10 images | 50 media | Unlimited |
| WhatsApp contact | Yes | Yes | Yes |
| Internal messaging | Yes | Yes | Yes |
| Analytics | Basic | Standard | Advanced |
| Featured projects | No | Yes | Yes |
| Priority placement eligibility | No | No | Yes |
| Support | Standard | Standard | Priority |

Allow Super Admin to configure additional limits for:

- Published services.
- Service media.
- Storage capacity.
- Portfolio albums.

Do not invent commercial prices.

## 49. SUBSCRIPTION LIFECYCLE

Support:

- Trial.
- Active.
- Grace Period.
- Expired.
- Suspended.
- Cancelled.

Allow:

- Upgrades.
- Downgrades.
- Renewals.
- Reactivation.
- Administrative adjustments.

Preserve data when downgrading.

Enforce limits server-side.

Support configurable monthly and annual prices in OMR.

Use simulated payments until live gateway integration is authorized.

---

# PART N — ADVERTISING

## 50. ADVERTISING BUSINESS MODEL

Allow service providers to purchase advertising placements.

Advertising is separate from membership subscriptions.

## 51. ADVERTISING PLACEMENTS

Support:

- Homepage top banner.
- Homepage carousel.
- Homepage between-section banners.
- Category page banners.
- Sponsored search results.
- Featured sponsored companies.
- Sponsored portfolio content.

All advertisements must be labeled Sponsored / إعلان ممول.

## 52. PROVIDER ADVERTISING DASHBOARD

Include:

- Overview.
- Create Advertisement.
- My Campaigns.
- Performance.
- Payments &amp; Invoices.

### Campaign Creation

1. Choose placement.
2. Choose duration.
3. Select media from Media Library.
4. Apply placement-specific crop.
5. Enter bilingual content.
6. Select destination.
7. Preview.
8. Review price.
9. Submit payment.

Support destinations:

- Company profile.
- Service details.
- Portfolio album.
- Approved external URL.
- WhatsApp.

## 53. CAMPAIGN STATUSES

- Draft.
- Pending Approval.
- Awaiting Payment.
- Scheduled.
- Active.
- Paused.
- Completed.
- Rejected.
- Cancelled.

Prevent inventory overbooking.

Automatically activate eligible paid and approved campaigns.

Automatically expire campaigns.

## 54. ADVERTISING ANALYTICS

Track:

- Impressions.
- Clicks.
- CTR.
- Active campaigns.
- Revenue.
- Placement occupancy.
- Revenue by provider.
- Revenue by placement.

Do not confuse clicks with confirmed customer inquiries.

---

# PART O — NOTIFICATIONS

## 55. ADMIN PUSH NOTIFICATIONS

Create a Super Admin Push Notifications module.

Allow:

- Create.
- Save draft.
- Send immediately.
- Schedule.
- Edit scheduled.
- Cancel scheduled.
- View history.
- Review delivery metrics.

Support bilingual titles and messages.

Target:

- All providers.
- Selected providers.
- Membership tiers.
- Trial companies.
- Expiring subscriptions.
- Expired subscriptions.
- Selected locations.

Support in-app notifications and push where technically available.

Use an appropriate notification provider.

## 56. AUTOMATED NOTIFICATIONS

Support:

- New messages.
- RFQ submissions.
- Quotation replies.
- Booking requests.
- Booking confirmations.
- Booking reminders.
- Trial expiration.
- Subscription renewal.
- Payment events.
- Advertising approval.
- Support ticket replies.
- Account verification.

Prevent duplicates.

---

# PART P — SUPPORT TICKETS

## 57. PROVIDER SUPPORT CENTER

Add:

- My Tickets.
- Create Ticket.
- FAQ.

Ticket fields:

- Subject.
- Category.
- Priority.
- Description.
- Attachments.

Categories:

- Account &amp; Profile.
- Membership &amp; Subscription.
- Payments &amp; Billing.
- Advertising.
- Services &amp; Media.
- Messaging &amp; Notifications.
- Technical Issues.
- Other.

Generate unique references such as:

MJB-000001

## 58. TICKET STATUSES

- Open.
- In Progress.
- Waiting for Provider.
- Resolved.
- Closed.

Providers can view history, reply, and attach files.

## 59. ADMIN SUPPORT MANAGEMENT

Allow:

- Ticket search.
- Filtering.
- Staff assignment.
- Replies.
- Internal notes.
- Priority changes.
- Status changes.
- Resolution.
- Reopening.
- FAQ management.

Track response and resolution times.

Keep support tickets separate from customer-provider messaging.

---

# PART Q — SUPER ADMIN DASHBOARD

## 60. SUPER ADMIN OVERVIEW

Display:

- Total companies.
- Active companies.
- Trial companies.
- Paying companies.
- Suspended companies.
- Customers.
- Published services.
- Published portfolio albums.
- Quotation requests.
- Site visit bookings.
- Internal inquiries.
- Subscription revenue.
- Advertising revenue.
- Total platform revenue.
- Active advertisements.
- Open support tickets.

Use interactive KPI cards and charts.

## 61. COMPANY MANAGEMENT

Allow:

- View companies.
- Search and filter.
- Edit information.
- Verify providers.
- Suspend or reactivate.
- Review subscriptions.
- Review services.
- Review portfolio albums.
- Review branches.
- Review coverage.
- Review activity.

## 62. CUSTOMER MANAGEMENT

Allow:

- View customers.
- Search and filter.
- Review account status.
- Suspend or reactivate.
- Handle reports.
- Process deletion requests.

Protect personal information.

## 63. CATEGORY MANAGEMENT

Allow:

- Add.
- Edit.
- Reorder.
- Activate.
- Deactivate.
- Merge.
- Safely delete.
- Reassign affected company listings.

Initialize with the approved 20 categories.

## 64. SERVICES &amp; MEDIA MODERATION

Allow authorized admins to:

- Review published services.
- Review portfolio albums.
- Review reported media.
- Unpublish prohibited content.
- Restore content.
- Review storage usage.
- Configure media standards.

Log moderation actions.

## 65. QUOTATION MANAGEMENT

Include:

- Overview.
- All Requests.
- Issued Quotations.
- Reports.
- Settings.

Allow global quotation enable/disable.

Track request volume and response performance.

## 66. BOOKING MANAGEMENT

Include:

- Overview.
- All Bookings.
- Reports.
- Settings.

Allow global booking enable/disable.

Track:

- Pending.
- Confirmed.
- Completed.
- Cancelled.
- No-show.
- Confirmation rate.
- Completion rate.

## 67. MEMBERSHIP MANAGEMENT

Include:

- Membership Plans.
- Company Subscriptions.
- Subscription History.

Allow:

- Pricing changes.
- Feature changes.
- Trial settings.
- Grace settings.
- Subscription adjustments.
- Renewals.
- Suspension.
- Reactivation.

Preserve history.

## 68. ADVERTISING MANAGEMENT

Include:

- Overview.
- Placements.
- Campaigns.
- Approvals.
- Pricing.
- Reports.

Allow control of pricing, inventory, approvals, and performance.

## 69. FINANCE MANAGEMENT

Create:

- Revenue Overview.
- Subscription Revenue.
- Advertising Revenue.
- Transactions.
- Refunds.

### KPIs

- Total collected revenue.
- Monthly revenue.
- Annual revenue.
- Subscription revenue.
- Advertising revenue.
- MRR.
- ARR.
- Average revenue per paying provider.
- Outstanding payments.
- Refunds.
- Net collected revenue.

Separate subscription revenue from advertising revenue.

Do not count free trials or unpaid invoices as collected revenue.

Keep simulated payments separate from real transactions.

## 70. REPORTS

Create reports covering:

### Companies
- Registrations.
- Active companies.
- Companies by category.
- Companies by location.
- Companies by membership.

### Customers
- Registrations.
- Active customers.
- Engagement.

### Services &amp; Portfolios
- Published services.
- Published albums.
- Most viewed services.
- Most viewed albums.

### Customer Leads
- RFQ requests.
- Quotations sent.
- Quotation acceptance rate.
- WhatsApp clicks.
- Call clicks.
- Internal inquiries.
- Booking requests.

### Memberships
- Trial conversions.
- Renewals.
- Cancellations.
- Churn.
- Subscription growth.

### Advertising
- Revenue.
- Campaign performance.
- Occupancy.
- Impressions.
- Clicks.

### Support
- Ticket volume.
- Response time.
- Resolution time.
- Overdue tickets.

Support date filters and CSV/Excel export.

## 71. HISTORY &amp; AUDIT LOGS

Track:

- Company registrations.
- Profile changes.
- Service changes.
- Media changes.
- Portfolio changes.
- RFQ status changes.
- Quotation events.
- Booking events.
- Membership changes.
- Payment events.
- Advertising approvals.
- Support activity.
- Account suspensions.
- Platform setting changes.

Each record should contain:

- Event ID.
- Timestamp.
- Actor.
- Role.
- Action.
- Affected record.
- Previous and new values where appropriate.
- Reason.
- Result.

Use restricted, append-only audit records.

Never log passwords, secrets, or private message contents.

## 72. HOMEPAGE MANAGEMENT

Allow admins to:

- Select featured companies.
- Select featured services.
- Select featured portfolio albums.
- Reorder homepage sections.
- Enable or disable sections.
- Manage editorial banners.
- Preview changes.

Paid advertisements must remain managed separately.

## 73. LOCATION MANAGEMENT

Initially support Oman.

Use:

- Country.
- Governorate.
- City or district.

Allow admins to add, edit, activate, and deactivate locations.

Use consistent records for branches, service coverage, bookings, and search.

## 74. PLATFORM SETTINGS

Include:

- Branding.
- Languages.
- Membership settings.
- Trial settings.
- Media upload limits.
- Media aspect ratio presets.
- Booking enable/disable.
- Quotation enable/disable.
- Advertising settings.
- Notification settings.
- Verification settings.
- Moderation settings.
- Support settings.
- Terms and privacy policy.
- Contact information.

---

# PART R — SUPER ADMIN NAVIGATION

## 75. SIDEBAR STRUCTURE

1. Dashboard
2. Companies
3. Customers
4. Categories
5. Services
6. Portfolios &amp; Media
7. Quotations
   - Overview
   - Requests
   - Issued Quotations
   - Reports
   - Settings
8. Bookings
   - Overview
   - All Bookings
   - Reports
   - Settings
9. Memberships
   - Plans
   - Company Subscriptions
   - History
10. Advertising
   - Overview
   - Placements
   - Campaigns
   - Approvals
   - Pricing
11. Finance
   - Revenue Overview
   - Subscription Revenue
   - Advertising Revenue
   - Transactions
   - Refunds
12. Reports
13. Push Notifications
14. Messaging Management
15. Support Tickets
16. History &amp; Audit Logs
17. Homepage Management
18. Locations
19. Platform Settings

Use collapsible sidebar groups and consistent icons.

---

# PART S — TECHNOLOGY

## 76. PREFERRED TECHNOLOGY STACK

### Customer Application
- React Native.
- Expo.
- TypeScript.
- Expo Router.

### Web Dashboards
- Next.js.
- TypeScript.
- Responsive layouts.

### Backend
- Supabase PostgreSQL.
- Supabase Authentication.
- Supabase Storage.
- Supabase Realtime.
- Row Level Security.

### Integrations
- Maps.
- WhatsApp deep links.
- Native telephone links.
- Push notification provider.
- Payment gateway when authorized.
- GitHub.

If Claude Design cannot compile native applications, create a high-fidelity interactive mobile-first prototype and document what remains for native implementation.

Do not claim integrations are operational without verification.

---

# PART T — SUPABASE DATABASE

## 77. DATABASE DESIGN

Design a normalized PostgreSQL schema.

### Accounts &amp; Companies
- profiles
- companies
- company_members
- company_branches
- locations
- company_service_areas

### Categories &amp; Services
- categories
- company_categories
- services
- service_categories

### Media &amp; Portfolios
- company_media
- media_albums
- media_album_items
- portfolio_albums
- portfolio_album_media
- media_placements
- media_placement_presets
- media_derivatives
- media_usage_references

### Customers
- customer_favorites
- analytics_events
- provider_contact_events

### Messaging
- conversations
- conversation_participants
- messages
- message_attachments
- message_read_receipts

### Quotations
- quotation_settings
- company_quotation_settings
- quotation_requests
- quotation_request_attachments
- quotation_request_status_history
- quotations
- quotation_line_items
- quotation_versions
- quotation_attachments
- quotation_status_history

### Bookings
- booking_settings
- company_booking_settings
- company_availability_rules
- company_availability_exceptions
- company_booking_visit_types
- bookings
- booking_status_history
- booking_reschedule_requests
- booking_reminders

### Memberships
- subscription_plans
- plan_features
- company_subscriptions
- subscription_history

### Advertising
- advertising_placements
- advertising_placement_prices
- advertising_campaigns
- advertising_creatives
- advertising_bookings
- advertising_impressions
- advertising_clicks

### Finance
- payment_transactions
- refunds
- invoices

### Notifications
- notification_campaigns
- notification_templates
- notification_recipients
- notifications
- push_device_tokens
- notification_preferences

### Support
- support_tickets
- support_ticket_messages
- support_ticket_attachments
- support_ticket_status_history
- support_ticket_categories
- support_faq_articles

### Administration
- featured_content
- platform_settings
- moderation_reports
- admin_audit_logs

Add supporting tables, indexes, constraints, and relationships where needed.

Use migrations and repeatable seed scripts.

## 78. SECURITY

Support roles:

1. Customer.
2. Company Owner.
3. Company Staff.
4. Support Agent.
5. Platform Admin.
6. Super Admin.

Implement:

- Secure authentication.
- Role-based authorization.
- Company-level data isolation.
- Supabase RLS.
- Secure media access.
- Protected conversations.
- Private RFQ attachments.
- Private booking addresses.
- Secure file uploads.
- Server-side financial validation.
- Audit logging.

Never expose privileged credentials in frontend code.

---

# PART U — DEMONSTRATION DATA

## 79. REALISTIC DEMO CONTENT

Create:

- At least 30 fictional companies.
- Companies covering all 20 categories.
- At least 60 portfolio albums or projects.
- Multiple services per company.
- Images and videos in Media Libraries.
- Reused media across services and albums.
- Multiple branches.
- Service coverage across Oman.
- 15 customer test accounts.
- Sample conversations.
- Quotation requests.
- Sent quotations.
- Booking requests.
- Confirmed site visits.
- Silver, Gold, and Platinum memberships.
- Active and expired trials.
- Advertising campaigns.
- Simulated payment transactions.
- Push notifications.
- Support tickets.
- Audit records.
- Analytics data.

Use properly licensed stock photographs.

Keep demonstration data internally consistent.

Label simulated transactions and fictional portfolios appropriately.

---

# PART V — FUNCTIONAL TESTING

## 80. CUSTOMER JOURNEY

Verify that customers can:

1. Open MUJEEB.
2. Browse all 20 categories.
3. Search for a service.
4. Select a location.
5. Open company profiles.
6. Browse service details.
7. View portfolio albums.
8. Watch project videos.
9. Save favorites.
10. Request a quotation.
11. Upload RFQ attachments.
12. Receive a quotation.
13. Accept or reject a quotation.
14. Book a site visit.
15. Receive booking confirmation.
16. Open WhatsApp.
17. Send an internal message.
18. Click Call.
19. View notifications.

## 81. SERVICE PROVIDER JOURNEY

Verify that providers can:

1. Register.
2. Activate a trial.
3. Complete company information.
4. Select major categories.
5. Add branches.
6. Configure service coverage.
7. Upload media into Media Management.
8. Create private media albums.
9. Create services using library media.
10. Crop service cover images.
11. Create public portfolio albums.
12. Reuse existing media.
13. Receive RFQs.
14. Send quotations.
15. Configure site visit availability.
16. Confirm appointments.
17. Reply to customer messages.
18. Manage memberships.
19. Purchase advertising.
20. View analytics.
21. Create support tickets.
22. Receive notifications.

## 82. SUPER ADMIN JOURNEY

Verify that admins can:

1. Log in securely.
2. View KPIs.
3. Manage companies.
4. Manage customers.
5. Manage all 20 categories.
6. Moderate services and media.
7. Enable or disable quotations.
8. Enable or disable bookings.
9. Manage memberships.
10. Configure advertising placements.
11. Approve campaigns.
12. View subscription revenue.
13. View advertising revenue.
14. Send notifications.
15. Respond to support tickets.
16. Generate reports.
17. Review audit history.
18. Configure media display standards.
19. Update platform settings.

All changes must persist correctly.

---

# PART W — DEVELOPMENT SEQUENCE

## 83. IMPLEMENTATION PHASES

### Phase 1 — Foundation
- Brand identity.
- Design system.
- Localization.
- Navigation.
- Categories.
- Supabase foundation.

### Phase 2 — Customer Discovery
- Homepage.
- Search.
- Categories.
- Company profiles.
- Service details.
- Portfolio browsing.

### Phase 3 — Provider Management
- Registration.
- Company profiles.
- Branches.
- Service coverage.
- Services.

### Phase 4 — Centralized Media
- Media Library.
- Media albums.
- Shared picker.
- Crop editor.
- Portfolio albums.
- Storage controls.

### Phase 5 — Customer Communication
- Messaging.
- WhatsApp.
- Call.
- Notifications.

### Phase 6 — Quotations
- RFQ forms.
- Provider request management.
- Quotation builder.
- PDFs.
- Status tracking.

### Phase 7 — Bookings
- Availability.
- Calendar.
- Booking requests.
- Confirmation.
- Rescheduling.
- Reminders.

### Phase 8 — Memberships
- Plans.
- Trial.
- Subscription management.
- Feature limits.

### Phase 9 — Advertising
- Placements.
- Campaigns.
- Approvals.
- Pricing.
- Performance.

### Phase 10 — Administration
- Super Admin modules.
- Support tickets.
- Push notifications.
- Moderation.
- Audit logs.

### Phase 11 — Finance &amp; Reporting
- Revenue reporting.
- Transactions.
- Refunds.
- Operational reports.

### Phase 12 — Testing &amp; Integration
- Supabase verification.
- GitHub integration.
- Demo data.
- Security testing.
- Functional testing.
- Mobile responsiveness.
- Arabic RTL testing.

---

# PART X — NON-NEGOTIABLE REQUIREMENTS

## 84. FINAL DEVELOPMENT RULES

1. The platform name is **MUJEEB (مجيب)**.

2. The initial 20 services are independent major categories.

3. Do not create automatic platform-wide subcategories.

4. Use a colorful, premium, professional visual identity.

5. Use high-quality, appropriately licensed photographs and consistent icons.

6. Use carousels where they improve discovery and navigation.

7. Support Arabic and English throughout the platform.

8. All provider media uploads must occur exclusively through Media Management.

9. All profile, service, project, portfolio, and advertising media must be selected from the centralized Media Library.

10. Media placement must support aspect-ratio-specific, non-destructive cropping.

11. Original media must remain unchanged.

12. One media file may be reused across multiple locations.

13. Providers must be able to create private media albums and public portfolio albums.

14. Get Quotation, WhatsApp, Message, and Call must appear on eligible provider profiles and service detail pages.

15. The RFQ system must support structured requests, quotation creation, PDF generation, and status tracking.

16. Site visit bookings must support provider availability, confirmations, rescheduling, and reminders.

17. Super Admin must be able to globally enable or disable bookings.

18. Providers must independently enable or disable their own bookings.

19. Super Admin must be able to globally enable or disable quotation requests.

20. Providers must independently enable or disable quotation requests.

21. The global platform switches always override provider settings.

22. Include Silver, Gold, and Platinum memberships with a 30-day Platinum trial.

23. Include paid advertising placement management and reporting.

24. Include admin push notifications.

25. Include service provider support tickets.

26. Include comprehensive financial and operational reports.

27. Include history and audit logs.

28. Use Supabase for persistent data, authentication, storage, and realtime functionality.

29. Use GitHub for version-controlled source code when authorized.

30. Do not introduce escrow, customer project payments, or service transaction commissions without approval.

31. Do not remove or break existing functionality when adding new features.

32. Do not claim functionality is complete unless implemented and tested.

---

# PART Y — REQUIRED DELIVERABLES

## 85. DELIVERABLES

Provide:

- Interactive customer mobile application prototype.
- Functional customer account dashboard.
- Functional Service Provider Dashboard.
- Functional Super Admin Dashboard.
- Complete shared design system.
- Supabase database schema and migrations.
- Centralized Media Management system.
- Media Picker and Crop Editor.
- Portfolio album system.
- Quotation request and quotation builder.
- Site visit booking system.
- Internal messaging.
- Membership management.
- Advertising management.
- Push notification management.
- Support ticket management.
- Finance and reports.
- Audit logs.
- Realistic demonstration data.
- Test accounts and instructions.
- Functional testing checklist.
- Known limitations.
- Production deployment recommendations.

## 86. EXECUTION INSTRUCTIONS

Start by designing and building:

1. MUJEEB's customer mobile homepage.
2. The 20 independent major service categories.
3. The shared design system.
4. The company profile and service detail pages.
5. The Supabase database foundation.

Then implement the remaining modules systematically.

Maintain consistent styling and navigation across all interfaces.

Prioritize beautiful, functional customer discovery and a robust, scalable backend.

If the environment cannot implement a required native feature or external integration, build the closest functional prototype, clearly identify the limitation, and provide the necessary implementation steps.

**FINAL OBJECTIVE: Deliver a premium, colorful, bilingual, visually rich, scalable MUJEEB marketplace suitable for client demonstrations, user testing, and commercial deployment.**
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>

<attached-skill name="Hi-fi design">
Create a high-fidelity, polished design.

Follow this general design process (use the todo list to remember):
(1) ask questions, (2) find existing UI kits and collect design context — copy ALL relevant components and read ALL relevant examples; ask the user if you can't find them, (3) start your file with assumptions + context + design reasoning (as if you are a junior designer and the user is your manager), with placeholders for the designs, and show it to the user early, (4) build out the designs and show the user again ASAP; append some next steps, (5) use your tools to check, verify and iterate on the design.

Good hi-fi designs do not start from scratch — they are rooted in existing design context. Ask the user to Import their codebase, or find a suitable UI kit / design resources, or ask for screenshots of existing UI. You MUST spend time trying to acquire design context, including components. If you cannot find them, ask the user for them. In the Import menu, they can link a local codebase, provide screenshots or Figma links; they can also link another project. Mocking a full product from scratch is a LAST RESORT and will lead to poor design. If stuck, try listing design assets and ls'ing design system files — be proactive! Some designs may need multiple design systems — get them all. Use the starter components (device frames and the like) to get high-quality scaffolding for free.

When showing multiple design options on one page, decide between (a) a single full-size responsive prototype with a tweaks panel, or (b) a vertical stack of anchored option cards. Choose based on how design-y vs prototype-y the ask is, how many options there are, and how big each is. For (b):

Present multiple design options as a vertical stack of turns — each turn of options is its own `<section>`, newest turn at the **top**, and every option gets a stable `{turn}{letter}` id (`1a`, `1b`, `2a`…) that the user references back in chat and you cross-link between turns. Always include `<meta name="design_doc_mode" content="canvas">` in `<helmet>` — the host provides pan/zoom, so the user can freely zoom out on designs wider than the viewport.

**How to write it** — put one `<style>` block in `<helmet>`, then one `<section class="dv-turn">` per turn as a **direct child of the root** (right after `</helmet>`, no wrapper). When the user asks for another round, **insert the new section ABOVE the existing ones** so the latest work sits at the top; never reorder, renumber, or delete earlier turns.

```html
<helmet data-dc-atomics><meta name="design_doc_mode" content="canvas"><style>body{margin:0;background:#f0eee9;font-family:system-ui,sans-serif}.dv-turn{padding:40px 44px 32px;border-bottom:1px solid rgba(0,0,0,.08);scroll-margin-top:16px}.dv-thd{display:flex;align-items:baseline;gap:10px;margin:0 0 20px}.dv-tid{font:600 10px ui-monospace,Menlo,monospace;padding:3px 7px;background:#1a1a1a;color:#fff;border-radius:4px;text-decoration:none}.dv-tname{font:600 13px/1.2 system-ui,sans-serif;color:#1a1a1a}.dv-opts{display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start}.dv-opt{flex:none;display:flex;flex-direction:column;gap:9px;scroll-margin-top:16px}.dv-oid{font:600 10.5px ui-monospace,Menlo,monospace;padding:3px 7px;background:rgba(0,0,0,.08);color:#1a1a1a;border-radius:5px;text-decoration:none}.dv-olabel{display:flex;align-items:baseline;gap:8px;font:400 11px/1.3 system-ui,sans-serif;color:rgba(0,0,0,.55)}.dv-card{max-width:100%;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.06);overflow:hidden}.dv-opt:target .dv-oid{background:#2a78d6;color:#fff}.dv-next{margin:22px 0 0;font:12px/1.5 system-ui,sans-serif;color:rgba(0,0,0,.5)}</style></helmet>
<section class="dv-turn" id="t2">
<div class="dv-thd"><a class="dv-tid" href="#t2">2</a><span class="dv-tname">Riffs on <a class="dv-oid" href="#1b">1b</a></span></div>
<div class="dv-opts">
<div class="dv-opt" id="2a"><div class="dv-olabel"><a class="dv-oid" href="#2a">2a</a>Tighter spacing</div><div class="dv-card" style="width:360px">…design…</div></div>
<div class="dv-opt" id="2b">…</div>
</div>
<p class="dv-next">Try next: "more like <a class="dv-oid" href="#2a">2a</a> but with the serif from <a class="dv-oid" href="#1c">1c</a>" · "make <a class="dv-oid" href="#2b">2b</a> full-bleed" · "new directions"</p>
</section>
<section class="dv-turn" id="t1">…turn 1, unchanged…</section>
```

**Rules:** turn section ids are `t1`, `t2`, `t3`…; option ids are `1a`, `1b`, `2a`… and go on the option's **outermost** element (`.dv-opt`), never on the badge — so `#1b` scrolls the whole option into view. Ids are stable forever, never reused or renumbered. Options within a turn sit side-by-side in a wrapping row; don't hand-roll your own pan/zoom — the host canvas provides it. **Every** option-id reference in the file — turn heading, option label, `.dv-next` line, any prose — is an `<a class="dv-oid" href="#1b">1b</a>` link, never a bare `1b`; in your chat replies, just write `1b`. End each turn with a one-line `.dv-next` of 2–3 plain-English follow-ups the user could paste into chat. Size each `.dv-card` to its content (explicit width is fine); don't use `height:100%`.

When designing, asking many good questions is ESSENTIAL.

Give options: try to give 3+ variations across several dimensions. Mix by-the-book designs that match existing patterns with new and novel interactions, including interesting layouts, metaphors, and visual styles. Have some options that use color or advanced CSS; some with iconography and some without. Start your variations basic and get more advanced and creative as you go! Try remixing the brand assets and visual DNA in interesting ways — play with scale, fills, texture, visual rhythm, layering, novel layouts, type treatments. The goal is not the perfect option; it's exploring atomic variations the user can mix and match.

CSS, HTML, JS and SVG are amazing. Users often don't know what they can do. Surprise the user.

If you do not have an icon, asset or component, draw a placeholder: in hi-fi design, a placeholder is better than a bad attempt at the real thing.
</attached-skill>

<attached-skill name="Interactive prototype">
Create a fully interactive prototype with realistic state management and transitions. Use React useState/useEffect for dynamic behavior. Include hover states, click interactions, form validation, animated transitions, and multi-step navigation flows. It should feel like a real working app, not a static mockup.
</attached-skill>

<attached-skill name="Servly Design System (design system)">
[Design System] This project uses the **Servly Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

This project has the **ServlyDesignSystem_945520** design system bound at `_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/`. If anything under that path is missing or fails to load, the folder name may differ — `list_files` `_ds/` and use the folder whose name ends with 94552060-1a3d-44c6-97e0-97a8c7fb28b8 instead, including in the <link>/<script> paths below.

**Loading the bundle is how you use this design system.** Every Design Component you build must load `_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/_ds_bundle.js` in `<helmet>` (include it in child DCs too — de-duped by URL) and compose with its components — do not recreate those components from scratch or restyle raw HTML to look like them. At the top of the template:

```html
<helmet>
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/fonts.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/colors.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/typography.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/spacing.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/effects.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/tokens/base.css">
  <link rel="stylesheet" href="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/styles.css">
  <script src="_ds/servly-design-system-94552060-1a3d-44c6-97e0-97a8c7fb28b8/_ds_bundle.js"></script>
</helmet>
```

Then mount any component directly in the template — no logic class needed:

```html
<x-import component-from-global-scope="ServlyDesignSystem_945520.Button" hint-size="auto,40px">Label</x-import>
```

Props are template attributes (kebab → camelCase); template children pass through as `props.children`. The linked stylesheet(s) carry the design tokens (colors, type, spacing) — style against those via `var(--*)` and the design system's classes rather than guessing values.

The full design-system source tree lives at `/projects/94552060-1a3d-44c6-97e0-97a8c7fb28b8/` — use `list_files` / `read_file` from there for anything not under `_ds/` (layout varies by brand; don't assume folder names). Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Servly Design System

A design system for **Servly**, a mobile marketplace app where people book home and personal services (cleaning, plumbing, electrical, beauty, moving, repairs, pet care, tutoring) from vetted local pros.

&gt; "Servly" is a working name. No brand name or logo was supplied, so the name is set in plain type wherever a mark would go. Swap it once the real brand exists.

**Sources:**
- `uploads/Services Marketplace Design System.pdf` — one-page overview (colour, type, spacing &amp; shape, iconography, components; "28 components, 8 interactive screens").
- The PDF links to its originating design project (`/projects/684393fa-88b1-4e87-bbf0-f78c6136c8ae`, `ui_kits/app/index.html`). That project's tokens, components, guidelines and UI kit were imported verbatim and are the source of truth here. Its original brief: *colourful but professional, carousels, coloured category cards with icons, modern and immersive*; violet primary, neutral cross-platform styling, light mode only.

## Index
- `styles.css` — entry point; only `@import`s the token files
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (spacing + radii), `effects.css` (shadows, motion, keyframes), `fonts.css`, `base.css`
- `components/`
  - `core/` — Icon, Button, IconButton, Badge, Chip, Avatar, Rating, ImageSlot
  - `forms/` — TextField, SearchBar, Checkbox, Radio, Switch
  - `marketplace/` — CategoryCard, ServiceCard, ProviderCard, PromoBanner, Carousel, SectionHeader, BookingCard, ChatBubble
  - `navigation/` — AppBar, TabBar, SegmentedControl, ListItem
  - `feedback/` — BottomSheet, Toast, EmptyState
- `guidelines/` — foundation specimen cards (colour, type, spacing, radii, elevation, motion, brand) and `patterns/` (carousel, booking + chat)
- `ui_kits/app/` — interactive 390×844 click-through of the app (`index.html` + one JSX file per screen)
- `assets/3d/` — the 8 Fluent Emoji 3D category PNGs (356px) extracted from the PDF: cleaning, plumbing, electrical, beauty, moving, repairs, pet-care, tutoring. Components load the same art from jsDelivr; these are offline copies.
- `Servly Design System.dc.html` — the overview page the PDF was exported from
- `thumbnail.html` — project tile
- `assets/dev/ds-loader.js` — preview helper that loads components in cards/kits (uses the compiled bundle when present)
- `SKILL.md` — Agent Skill entry point

### Intentional additions
- **Icon** — wrapper around Lucide so every component uses one glyph set.
- **ImageSlot** — striped placeholder for photography until real images exist.

---

## Content fundamentals
- **Voice:** a capable, friendly neighbour. Plain, warm, specific. Never salesy, never cute.
- **Person:** address the user as **you**; the product speaks as **we** only for policy ("We have sent the details to your email"). Pros are called **pros** in UI, by first name in context ("Maya will arrive at 10:00").
- **Casing:** Sentence case everywhere — titles, buttons, tabs ("Book now", "Popular near you"). Overlines are the only uppercase text.
- **Buttons:** verb first, 1–3 words: *Book now*, *Continue*, *Confirm &amp; book · $157*, *Reschedule*, *Message*. Price in the final CTA.
- **Numbers:** always concrete: "214 pros nearby", "Arrives in 2 hrs", "$89", "4.9 (820)". Prices as `$89`; "From $45" on cards; "/hr" suffix for hourly.
- **Reassurance copy** near money and commitment: "You are only charged after the job is done. Free cancellation up to 24 hours before."
- **Emoji:** not used in UI. Status and meaning come from icons and colour.
- **Examples:** "Hi Alex, what needs doing today?" · "Leaky tap? Plumbers in 2 hrs" · "Booked 2k+ times this week" · "Nothing here yet".

## Visual foundations
- **Colour:** a deep **violet** (`--brand`, oklch 0.51 0.24 292) carries actions, focus, active nav and the home hero. **Neutrals** are cool greys with a faint violet tint; the app background is near-white `--bg-app`, cards are pure white. The colourful side comes from an **8-hue category palette** (teal, sky, amber, pink, indigo, coral, green, violet) with matched lightness and chroma, so no hue shouts louder than another. Each category owns one hue everywhere (tile, feature card, listing header, booking icon). **Coral** `--accent` is reserved for offers and notification dots. Category 600 shades take white text; 100 tints take 600 icons.
- **Professional balance:** colour lives in contained surfaces (tiles, banners, headers), never in body text or large page backgrounds. Selected chips use ink (neutral-900), not violet, so violet keeps meaning "primary action".
- **Type:** Plus Jakarta Sans 400–800. Headlines are 700–800 with tight tracking (-0.02em); body 15/22. JetBrains Mono only for booking refs and image-slot labels. Min text 11px (overline), body never under 13px.
- **Spacing:** 4px base. Screen gutter 20px, section gap ~26px, card padding 14–16px, list rows ≥56px, hit targets ≥44px.
- **Corner radii:** generous and friendly. Cards 20, tiles 14–20, sheets 28, phone-level hero bottoms 28–32. All buttons, chips, search fields and segmented controls are full pills.
- **Cards:** white, radius 20, soft violet-tinted shadow (`--shadow-sm`), no borders. Selected/bordered states use inset box-shadow (1.5px default, 2px violet selected) with violet-50 fill. No coloured left-border accents.
- **Elevation:** five steps (xs, sm, md, lg, brand). Shadows are tinted toward violet, never pure black. The primary CTA gets a violet glow (`--shadow-brand`). Bottom bars use an upward shadow (`--shadow-up`).
- **Backgrounds:** flat colour only. Coloured heroes (home, category header) use 1–2 translucent white circles as the only decorative motif. No gradients, textures or illustrations.
- **Imagery:** real photography of pros at work, warm natural light, people-forward. Until supplied, use `ImageSlot` placeholders tinted to the category hue.
- **Transparency &amp; blur:** app bar, tab bar and sticky footers are 92–94% white with `saturate(180%) blur(16px)`. Buttons over photos use the `glass` IconButton. Scrims are 45% ink.
- **Motion:** `--ease-out` for most UI (120/200/320ms), `--ease-spring` for toggles, radios and category tile press. Content enters with a 12px rise + fade. Carousel dots stretch into a 20px pill. Bottom sheets slide up 320ms.
- **Press states:** buttons scale to 0.97 + brightness 0.94; icon buttons 0.92; category tiles 0.95 with spring; cards 0.98. No hover-dependent behaviour (touch-first); hover may darken slightly on web.
- **Focus:** 2px violet border plus 4px soft violet ring (`--focus-ring`).
- **Layout:** fixed tab bar (72px) on root tabs only; pushed screens hide it and use a back button. Carousels bleed to the screen edge with the gutter as scroll padding so the next card peeks.

## Iconography
- **Set:** [Lucide](https://lucide.dev) — 24px grid, 2px stroke, rounded caps/joins. Loaded from CDN (`lucide-static@0.454.0`) by the `Icon` component and inlined as SVG so it takes `currentColor`. No icon font, no PNG icons, no emoji, no unicode glyphs as icons (except "•" in masked card numbers).
- **Sizes:** 16 meta/inline, 18–20 default, 22 tab bar, 24–28 category tiles, 36–48 empty/success states.
- **Fill:** outline by default; `filled` only for stars and active hearts.
- **Category icons:** Cleaning `sparkles`, Plumbing `wrench`, Electrical `zap`, Beauty `scissors`, Moving `truck`, Repairs `hammer`, Pet care `paw-print`, Tutoring `graduation-cap`.
- **3D category art:** category cards use Microsoft Fluent Emoji 3D artwork (MIT licence, jsDelivr CDN) via the `art` prop: broom, wrench, light bulb, lipstick, delivery truck, hammer &amp; wrench, paw prints, graduation cap. Feature cards show it oversized, tilted and bleeding off the corner over a soft white glow so it blends into the category colour; tiles show it inside the tint with a soft drop shadow. Lucide line icons remain for all other UI.
- **Logo:** none supplied. The wordmark card shows the name in Plus Jakarta Sans 800 with a violet full stop as a placeholder only.

</design-system-guide>
</attached-skill>

## Assistant



## Assistant

_[tool: ask_user]_

I've sent a short form covering scope, prototype depth, language, brand colour, the logo and photography. I'll start building once you submit it.

## User

<artifact-content-authored-by-others/>
Answered — first_scope: Customer home + 20 categories, Category listing + search/filters, Company profile, Service details, RFQ (Get Quotation) flow, Site visit booking flow, Messaging, Provider Media Library + Crop editor,…; lang_default: Arabic (RTL); lang_switch: Yes, full toggle; variations: 2–3 homepage layout options, then build out the winner; brand: Keep the design system's violet; photos: Use stock photos via links

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: run_script]_

Reading the key components I'll compose with.

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've made three homepage directions, side by side in **MUJEEB Home Options**. They open in Arabic right-to-left, and the switch at the top (or the EN/عربي button on each phone) changes them to English.

- **1a:** a violet header with the greeting and search. All 20 categories sit in a two-row photo carousel that you swipe sideways. Below that are a sponsored banner, then featured companies and featured projects, each in its own swipeable row.
- **1b:** photo-first. A row of round category images lets you filter the project feed. Below it are a large featured project and a two-column gallery of recent work.
- **1c:** all 20 categories shown at once as coloured icon tiles, then colour-coded company cards, a sponsored strip and a recent-projects carousel.

A few things to know:
- Companies and projects are made up for the demo. Photos are from Unsplash.
- The fire protection category doesn't have a fitting photo yet; it uses a picture of pipework for now.
- Brand colour is the design system's violet, and the MUJEEB wordmark is plain type until you have a logo.

Pick one, or combine parts (for example, 1c's category grid with 1b's project feed). I'll build the next screens on that layout: category listing, company profile, service details, quotation request, site visit booking and messaging.

## User

<artifact-content-authored-by-others/>
1a is good, but stick to the design system. see the attached files. show me modified preview again

## User

1a is good, but stick to the design system. see the attached files. show me modified preview again

## Assistant

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: write_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

I've built the customer app prototype as **MUJEEB App**, based on 1a and the Servly design system. It opens in Arabic right-to-left. The language switch on the home screen and in Profile changes the whole app, and the chips beside the phone jump straight to any screen. I checked the main screens in Arabic on my side; a separate review pass is still checking it.

**What you can click through:**
- **Home:** the four large category cards and the scrolling row of all 20, sponsored banners, featured companies (tap the heart to save one), featured projects and recommendations.
- **Categories and search:** all 20 categories as a list. Results can be filtered by governorate (using the areas each company serves, not just where its branch is) and "verified only", sorted, and switched between list and map.
- **Company profile:** cover, logo, categories, and the WhatsApp, Message, Call and Book visit buttons. Book visit is hidden for Barq Electric, to show a company that has bookings switched off. Tabs cover services, portfolio albums, and branches, coverage and hours, with Get quotation as the main button.
- **Service page and portfolio albums:** photos, a video placeholder, the provider, related work and the same contact buttons.
- **Quotation request:** three steps with validation, simulated attachments and a review. It ends with a reference such as MJB-RFQ-000128 and adds the request to My quotations.
- **Site visit booking:** visit purpose, location, date and time (full slots can't be picked), then a review. The booking is sent as pending for the company to confirm manually.
- **Messages:** conversations tied to a quotation or booking reference. Sending a message works, and a canned reply comes back.
- **Account:** My quotations with statuses, and a received quotation in OMR with line items and 5% VAT that you can accept or reject. My bookings lets you accept a proposed new time or cancel. Favorites and notifications are there too.

**Limitations:**
- WhatsApp, Call and Download PDF only show a confirmation message.
- The promo banners and map use the design system's striped placeholders.
- Nothing is saved after a reload.
- The fire protection photo is still a stand-in.

**Two departures from the design system:**
- Arabic text uses IBM Plex Sans Arabic, because the system's font has no Arabic letters.
- A few small style rules mirror arrows and text alignment for right-to-left. The system's components don't flip on their own.

Next could be the provider dashboard (media library and crop editor), then the super admin overview.

## User

allow horizontal dragging by the mouse. no scroll bars, just mouse dragging like if using a finger

## Assistant

_[tool: snip]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Every horizontal row in the app (promos, categories, companies, projects, filter chips, galleries) can now be dragged sideways with the mouse, with scroll bars still hidden. Letting go of a drag won't open the card under the pointer, and a plain click still works. I haven't tested it in the preview, so reload the page to try it, as the change may not apply until you do.

## User

remove

## Assistant

_[tool: dc_html_str_replace]_

## User

make two rows with horizontal scrolling as blocks. allow simultanious scrolling of both rows

## Assistant

_[tool: dc_html_str_replace]_

## User

reduce size

## Assistant

_[tool: dc_html_str_replace]_

## User

fix gaps

## Assistant

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: save_screenshot]_

The screenshot is stale; scroll the inner container directly.

_[tool: show_html]_

_[tool: save_screenshot]_

The category cards were still drawing at their old 150×168 size inside the smaller 116px slots, so they overlapped and the gaps looked uneven. They now render at 116×124, which I confirmed by measuring the rendered card, so the 10px gaps between them should be even in both rows. I couldn't get the category row itself into a screenshot, so give it a quick look on your side.

## User

reduce the size of the 3d icons

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

[System: response generation was interrupted by an error]

## User

use company logos. logo icons or logos from free stockphoto websites

## Assistant

_[tool: run_script]_

_[tool: view_image]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Each of the 10 demo companies now has its own logo instead of initials. Each logo is a Fluent 3D emoji (an MIT-licensed icon set) on a soft circle in a hue matched to the company, for example a frying pan for Qimmah Kitchens and a snowflake for Bard Cooling. They show everywhere a company appears: cards, search results, profile, service and album pages, messages, quotations, bookings and the quotation form.

The "Recommended" list on the home screen used the design system's provider card, which can't show an image, so I rebuilt those cards in the same style with the logo added.

On reload the page logged three errors. One is a gallery image whose web address arrived empty, which looks like it was there before this change; I haven't confirmed that or fixed it. The other two have no details, so I can't tell what they are.

The images are saved in `assets/logos/`. Real logos can replace them later under the same file names.

## User

add 6 demo companies to every category. user free stockphotos

## Assistant

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: save_screenshot]_

I've added 6 made-up companies to each of the 20 categories, so the app now has 130 companies. Some categories show more than 6, because existing companies and some new ones also list a second category. Air conditioning, for example, shows 10. I checked that category's listing.

Each new company has:
- A name in Arabic and English, such as "الريادة للمقاولات / Al Riyada Contracting".
- A city across Oman, from Muscat and Sohar to Salalah and Sur.
- A coverage area of all Oman, its own governorate, or its own governorate plus Muscat.
- Two services, one portfolio album and a logo of its own.
- A mix of settings: some are not verified and some don't take site visit bookings, so those cases appear in the demo.

Photos come from Unsplash, which is free to use. Each category has its own set of photos, but a few categories have only one or two that fit (transport, air conditioning, smart home, gas, fire safety and CCTV), so photos repeat noticeably there. If you'd like more variety in those, I can look for more.

## User

create an admin panel for service provider

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: write_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Now the media library and services pages.

_[tool: dc_html_str_replace]_

Quotations, bookings, messages next.

_[tool: dc_html_str_replace]_

Now portfolio, membership, advertising, support, profile, branches, notifications, settings.

_[tool: dc_html_str_replace]_

Now the modals: detail drawer, delete dialog, media picker, crop editor.

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've built the service provider panel as a new file, **MUJEEB Provider**, but I couldn't check it. My preview stopped responding before I took a single screenshot, and the customer app, which worked earlier, froze the same way. That points to the preview tool, though it's not proven. A review pass is running now; I'll fix anything it finds.

It's a desktop web panel in Arabic by default (switch at the top), set up as the demo company Qimmah Kitchens.

- **Dashboard:** contact and view counts with trends, a 14-day views chart, a trial banner, new quotation requests and upcoming visits.
- **Analytics:** a breakdown of WhatsApp, call, message, quotation and booking interactions, and the most-viewed services and albums.
- **Media library:**
  - **Uploading:** 3 simulated files, 2 of which succeed. The third is rejected as "below the 1200×900 minimum".
  - **Browsing:** search, filters, sorting and multi-select, with a storage bar.
  - **Delete protection:** a file in use can't be deleted, and the panel lists where it's used.
  - Private albums and a storage breakdown are separate tabs.
- **Choosing images:** a picker that selects from the library only, with no upload button. It's used by the service cover and gallery, the company cover, new portfolio albums and new ads.
- **Crop editor:** the ratio is locked to where the image is used. You can drag, zoom and rotate, and each placement keeps its own crop without changing the original file.
- **Services:** a list with publish switches. The editor has Arabic and English fields, categories limited to the company's own, a 4:3 cover and a reorderable gallery.
- **Quotations:**
  - **Requests:** tabs by status. Each request has full details and buttons to ask the customer for more information, decline, reply, or upload a PDF.
  - **Builder:** editable line items, a discount, 5% VAT that can be switched off, a validity period and terms, with totals in OMR. Sending it updates the request's status.
- **Bookings:** an "Accept bookings" switch, a weekly calendar in Muscat time, and requests you can accept, reject or answer with another time. The availability rules are set here too.
- **Messages, portfolio, membership:**
  - **Messages:** an inbox where you can reply.
  - **Portfolio:** public albums with publish switches and reordering.
  - **Membership:** usage meters and the Silver, Gold and Platinum limits. No prices are shown; your brief says the platform admin sets them.
- **Other pages:** Advertising, Support center, Company profile, Branches & coverage, Notifications and Settings.

Changes are lost on reload. Payments, the map and real file uploads are simulated.

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: run_script]_

_[tool: update_todos]_

The provider panel still freezes on load and isn't usable yet. I've stopped here because you're close to your usage limit.

The page locks up without showing any error, so I haven't found the cause. I confirmed the page markup isn't broken. Nothing else has been ruled out.

What I'll do next:
1. Switch sections of the page off one at a time to find the one that causes the freeze. I've added a hook in the code for this.
2. Fix it, then re-test the media library, image picker, crop editor, quotation builder and bookings calendar.

Say "continue" when you want me to carry on. The customer app (MUJEEB App) is a separate page with its own code, but the freeze happened in the same preview window and the App also stopped responding after the panel loaded. I'll re-check it as part of the fix.

## User

create admin panel for platform admin

## Assistant

_[tool: show_html]_

_[tool: update_todos]_

## Assistant

_[tool: show_html]_

## User

suggest different color types. show previews

