"use client";

import { useRouter } from "next/navigation";

export default function TermsAndConditionsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#021313] text-white flex flex-col items-center">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center w-[430px] h-[149px] bg-gradient-to-b from-[#11b9ab] to-[#222831] rounded-tl-[30px] rounded-tr-[30px] relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-[35px] h-[35px] bg-white/20 rounded-[18px] flex items-center justify-center hover:bg-white/30 transition-colors"
          aria-label="Go Back"
        >
          <svg className="w-2 h-4" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1L1 8L7 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-normal text-[20px] leading-[32px] text-center text-white">Terms &amp; Conditions</span>
      </div>

      {/* Content Section */}
      <div className="h-[758px] w-[398px] flex flex-col gap-[17px] mt-8">
        <span className="font-normal text-[13px] leading-[20px] text-white whitespace-pre-line">
Last Updated: 14/02/2026

Welcome to Clubwiz. By accessing or using the Clubwiz mobile app, website, or services (“Platform”), you agree to these Terms & Conditions (“Terms”). If you do not agree, please do not use Clubwiz.

1. About Clubwiz
Clubwiz is a nightlife discovery and decision-making platform that provides users with real-time insights about clubs, including music genre, crowd energy, vibe updates, pricing trends, and related nightlife information.
Clubwiz does not own or operate nightclubs unless clearly stated.

2. Eligibility
By using Clubwiz, you confirm that:
You are 18+ years old (or the legal drinking/club entry age in your city/state).
You are legally allowed to access nightlife venues in your region.
The information you provide is accurate and truthful.

3. User Account & Responsibility
To access certain features, you may need to create an account.
You agree:
Not to share your login details with others.
To keep your account secure.
That you are responsible for any activity under your account.
Clubwiz may suspend or terminate accounts that violate these Terms.

4. Real-Time Information Disclaimer
Clubwiz shows live and dynamic information, which may include:
crowd levels
entry pricing estimates
music genre updates
stories and vibe updates
While we try our best to keep everything accurate, you understand and agree that:
Club conditions may change quickly.
Prices, music, and crowd can change anytime.
Clubwiz cannot guarantee 100% real-time accuracy.

5. Club Entry, Pricing & Payments
Clubwiz may show:
estimated entry prices
dynamic pricing trends
ticket/event prices (if integrated)
Important:
Final entry decisions, pricing, and permissions are controlled by the club.
Clubwiz is not responsible if a venue denies entry for any reason (dress code, age, capacity, behavior, etc.)
If Clubwiz offers bookings in the future, additional booking terms may apply.

6. User Content (Stories, Posts, Updates)
If you upload content (photos, videos, reviews, stories, comments), you agree that:
You own the content OR have permission to upload it.
Your content does not violate laws or anyone’s rights.
You will not post offensive, illegal, abusive, sexual, violent, hateful, or misleading content.
License
By uploading content, you grant Clubwiz a non-exclusive, worldwide, royalty-free license to display, share, and promote that content within the platform for app-related purposes.

7. Prohibited Activities
You agree not to:
misuse the platform
post fake vibe updates or misleading information
harass other users
promote drugs or illegal activities
attempt to hack, scrape, reverse-engineer, or break the app
use Clubwiz for spam, scams, or fraudulent actions

8. Safety & Personal Responsibility
Nightlife involves risks.
By using Clubwiz, you acknowledge that:
You are responsible for your own safety.
Clubwiz is not liable for incidents inside clubs, outside venues, or during travel.
Always follow local laws and behave responsibly.

9. Third-Party Links & Venues
Clubwiz may contain links or references to:
clubs
event organizers
ticketing platforms
social media pages
Clubwiz is not responsible for third-party services, pricing, behavior, or policies.

10. Location & Permissions
Clubwiz may request access to:
your location (to show nearby clubs)
camera/gallery (to upload stories)
notifications (to send updates)
You can control permissions through your device settings.

11. Privacy
Your use of Clubwiz is also governed by our Privacy Policy.  We recommend reading it carefully.

12. Termination
Clubwiz may suspend or terminate your access if:
you violate these Terms
your behavior harms the platform or other users
required by law
You may stop using Clubwiz anytime.

13. Limitation of Liability
To the maximum extent allowed by law:
Clubwiz is provided “as is” and “as available.”
Clubwiz is not liable for any direct or indirect losses related to club experiences, entry denial, pricing changes, or inaccurate real-time information.
Clubwiz is not responsible for any injury, dispute, or loss occurring at venues.

14. Changes to Terms
Clubwiz may update these Terms from time to time.  If major changes are made, we may notify users through the app.
Continued use after changes means you accept the updated Terms.

15. Governing Law
These Terms are governed by the laws of India, unless stated otherwise.
Any disputes will be subject to the courts of Nagpur.

16. Contact
For questions or support, contact:
Clubwiz Support  Email: [your email]  Website: [your website]
        </span>
      </div>
    </div>
  );
}
