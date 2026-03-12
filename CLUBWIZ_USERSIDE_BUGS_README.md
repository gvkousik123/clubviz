# Clubwiz — User Side Bug Fix README

> Covers all issues from the **User Side Issues** tab in the Clubwiz Error document.

---

## 📁 User Side Issues

---

### BUG-U01 — Search Not Returning Partial Match Results

**Priority:** High
**Page:** Search

**Current Behavior:**
Searching for partial strings like `"The best hol"` or `"Ritvik"` returns no results, even when matching clubs or events exist. The page shows: *"No results found"*.

**Expected Behavior:**
Search should return all relevant results that contain or match the typed characters, even if the full word has not been entered (partial / substring match).

**Fix Instructions:**
- Update the search API query to use partial matching:
  - **SQL:** `WHERE name LIKE '%searchTerm%'`
  - **MongoDB:** `{ name: { $regex: searchTerm, $options: 'i' } }`
  - **Elasticsearch:** use `match_phrase_prefix` or `wildcard` query
- Make the search case-insensitive.
- On the frontend, debounce the search input (300ms recommended) to avoid excessive API calls while typing.

---

### BUG-U02 — Remove "Filter by Date Range" Option

**Priority:** Low
**Page:** Search / Filter

**Current Behavior:**
A "Filter by Date Range" section is shown with `START DATE` and `END DATE` date picker fields.

**Expected Behavior:**
This filtering option should be completely removed from the UI.

**Fix Instructions:**
- Locate the filter component rendering the "Filter by Date Range" section.
- Remove the `START DATE` and `END DATE` date picker fields and their container/heading.
- Remove associated state variables (`startDate`, `endDate`) and their handlers.
- Remove date range filtering logic from any API calls.

---

### BUG-U03 — Wrong Club Name Shown on "Write a Review" Page

**Priority:** High
**Page:** Write a Review

**Current Behavior:**
When a user selects a specific club (e.g., Hitesh's Club) to write a review, the Write a Review page incorrectly displays a different club's name at the top (e.g., *"DABO CLUB & KITCHEN"*).

**Expected Behavior:**
The Write a Review page must display the name of the club the user actually selected.

**Fix Instructions:**
- Inspect how the `clubId` is being passed to the Write a Review page (route params, navigation state, or global state).
- The bug likely reads the wrong club — e.g., the first club in a list rather than the selected one.
- Fix the binding: use the `clubId` from the route/navigation param to fetch and display the correct club details.
- Add a null-check: if `clubId` is missing, redirect back with an error rather than defaulting to another club.

---

### BUG-U04 — Review Not Reflecting After Submission

**Priority:** High
**Page:** Club Details — Reviews section

**Current Behavior:**
After writing and submitting a review, it does not appear on the club's page.

**Expected Behavior:**
The submitted review should appear immediately (or after a brief reload) in the reviews section.

**Fix Instructions:**
- Confirm the review POST API is returning a success response. If not, debug the API first.
- If the API succeeds but the UI doesn't update:
  - Invalidate and refetch the reviews query after successful submission:
    ```js
    queryClient.invalidateQueries(['reviews', clubId]);
    ```
  - Or optimistically prepend the new review to the local list.
- If reviews go through a moderation/approval step, show the user a message:
  *"Your review has been submitted and is pending approval."*

---

### BUG-U05 — "Leave a Review" Entire Button Row Should Be Clickable

**Priority:** Medium
**Page:** Club Details

**Current Behavior:**
Only the small arrow icon (→) on the right side of the "Leave a Review" row is clickable. Tapping/clicking the rest of the row does nothing.

**Expected Behavior:**
The entire "Leave a Review" row/button should be tappable as one unit.

**Fix Instructions:**
- Locate the "Leave a Review" component.
- Move the `onClick` / `onPress` handler to the outermost container of the row, not just the arrow icon child.
- Remove any `pointer-events: none` CSS that might be blocking clicks on parts of the row.
- Ensure `cursor: pointer` is applied to the full row.
- The touch/click target should be at least 44×44px (accessibility best practice).

---

### BUG-U06 — Entry Charges Section Should Be Hidden When No Event Exists

**Priority:** Medium
**Page:** Club Details

**Current Behavior:**
The `Entry Charges` section (with Couple / Male / Female tabs showing *"Entry charges not available"*) is always displayed, even when no active or upcoming event exists for the club.

**Expected Behavior:**
The Entry Charges section should only be shown when the club has an active or upcoming event.

**Fix Instructions:**
- Conditionally render the Entry Charges component based on event availability:
  ```jsx
  {hasActiveOrUpcomingEvent && <EntryChargesSection />}
  ```
- Derive the `hasActiveOrUpcomingEvent` flag from the event data associated with the club.
- While event data is loading, show nothing or a skeleton — do not default to showing the section.

---

### BUG-U07 — "Now Playing" Section — Data Source Unclear

**Priority:** Medium
**Page:** Club Details — Now Playing section

**Current Behavior:**
The "Now Playing" section shows *"DJ is not playing"* with genre tags (EDM, House). It is unclear how this data is being captured or kept up to date.

**Expected Behavior:**
The data source for the Now Playing section needs to be defined and implemented clearly.

**Fix Instructions:**
- **Discuss with the product/business team** to confirm the intended data flow:
  - Option A: Club admin manually updates the current DJ name and genres from the admin panel.
  - Option B: Automated integration with a music/streaming service API.
  - Option C: Real-time updates via WebSocket when a DJ checks in.
- Implement the agreed approach and connect it to the Now Playing UI.
- If no data source is defined yet, **hide the Now Playing section** until it is properly implemented to avoid showing stale/incorrect info.

---

### BUG-U08 — Unable to View Story from Club Details Page

**Priority:** High
**Page:** Club Details — Stories

**Current Behavior:**
Story thumbnails (circular rings, e.g., on Hitesh's Club) are visible on the Club Details page, but tapping them does not open or play the story.

**Expected Behavior:**
Tapping a story ring/thumbnail on the Club Details page should open the story viewer.

**Fix Instructions:**
- Verify the story thumbnail has an `onClick` / `onPress` handler attached.
- Ensure the story viewer is triggered with the correct `storyId` or `clubId`.
- Check for broken navigation (missing route, undefined param, or incorrect screen name).
- Verify the story data is being fetched and passed correctly to the story viewer component.

---

### BUG-U09 — Unable to Update Profile Information (Network Error)

**Priority:** 🔴 Critical
**Page:** User Profile — Edit Profile

**Current Behavior:**
When a user tries to update their profile (name, email, phone), a red banner appears:
`"Update Failed — Network Error"`
No changes are saved.

**Expected Behavior:**
Profile information should update successfully and reflect the new data immediately.

**Fix Instructions:**
- Open DevTools / network log and inspect the exact request and response when `Update` is tapped.
- Common causes:
  - Wrong or outdated API endpoint URL
  - Missing or expired `Authorization` header — ensure: `Authorization: Bearer <token>`
  - CORS error on the backend
  - Malformed request body (similar to the JSON error in Edit Club — check for `undefined` or `NaN` values)
- Log the exact error from the response and fix accordingly.
- After a successful update, refresh the profile data in app state/store so the UI reflects changes.

---

### BUG-U10 — Bookmarked Club Not Appearing in Favourite Clubs

**Priority:** High
**Page:** Favourite Clubs

**Current Behavior:**
After bookmarking/favoriting a club, the Favourite Clubs page still shows:
*"No Favorite Clubs — Start adding clubs to your favorites to see them here."*
The bookmarked club does not appear.

**Expected Behavior:**
Clubs the user has bookmarked should immediately appear in the Favourite Clubs section.

**Fix Instructions:**
- Confirm the bookmark API call returns a success response (200/201). If not, debug the API endpoint.
- If the API succeeds but the UI doesn't update:
  - Invalidate and refetch the favourites query after bookmarking:
    ```js
    queryClient.invalidateQueries(['favouriteClubs', userId]);
    ```
  - Or optimistically add the club to the favourites list in local state.
- Verify the correct `userId` is being sent in the bookmark request.
- On the Favourite Clubs page, confirm the correct `userId` is being used to fetch the list.

---

## Summary Table

| Bug ID | Description | Priority |
|--------|-------------|----------|
| BUG-U01 | Search not returning partial match results | High |
| BUG-U02 | Remove "Filter by Date Range" option | Low |
| BUG-U03 | Wrong club name on Write a Review page | High |
| BUG-U04 | Review not showing after submission | High |
| BUG-U05 | Full "Leave a Review" row should be clickable | Medium |
| BUG-U06 | Hide Entry Charges section when no event exists | Medium |
| BUG-U07 | Clarify / implement "Now Playing" data source | Medium |
| BUG-U08 | Cannot view story from Club Details page | High |
| BUG-U09 | Profile update fails with Network Error | 🔴 Critical |
| BUG-U10 | Bookmarked club not appearing in Favourite Clubs | High |

---

*Clubwiz User Side — Bug Report — March 2026*
