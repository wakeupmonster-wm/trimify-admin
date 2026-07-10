1. If KYC is approved, in the user management, we don't need to show the option, Reject and Accept buttons. ✅

2. In Profile Report remove the extra functionality of reply to report. ⏳

3. In user management in financial tab in grant subscription, so when user is premium, we are blocking the grant subscription with a green background, but it should be with a grey background. ✅

4. Add word limits when we are suspending the user and blocking the user when we are giving the custom reason for banning or suspending this user. ✅ If word length increase then success button is not-allowed. 👍

5. In user management when we are deleting the photo from the gallery from the admin panel, it was deleted from the admin API, but when we are seeing it in the user app the image wasn't deleted so please fix it.
⚠️ Issue #5 — App-Side (Mobile) Issue Hai, Admin Panel Nahi hai

Kya ho raha hai: Admin panel se photo delete karte ho → Admin API successfully Cloudinary/DB se delete karta hai ✅ → Admin panel ka Redux state bhi sahi update hota hai ✅

Problem kahan hai: "User app" (mobile app) alag codebase hai — uske paas is deletion ka koi notification/signal nahi aata. Mobile app ya toh:

Purana cached data serve karta rehta hai
Real-time sync nahi hai admin actions ke saath
Frontend (admin panel) me kya fix ho sakta hai: Kuch nahi — kyunki admin panel apna kaam sahi kar raha hai. Yeh fix backend pe hoga (WebSocket / Push Notification / FCM se mobile app ko batana ki "teri gallery update hui") ya mobile app ke codebase mein (refresh on app foreground, etc.)

Admin panel me koi bug nahi hai is issue se related.

6. In User Management Discovery tab, in advanced search filter, the alignment of psiodic and the selection. It should have the same spacing between like we are having in the attribute. ✅

7. In user management in the discovery tab the global visibility is not working in the user app when I switched to the visibility to the private, but still it was showing vis global visibility everyone public. It should show the private mode. And also while hitting the API, we are getting the 200 response, but as soon as a user kills the app and open it again, the visibility again changed to discoverable. It should stay private if a user has changed it. ✅ [⚠️ This API endpoint "/api/v1/profile/visibility" use in app, just update one thing, Changes body key name "globalVisibility" to "visibility". ]

8. In user management transaction tab in payment record section we are showing amount and then in right side of amount we are showing AUD so please show the AUD next to the header amount and I don't know like the payment record it was didn't showing like which payment record it it is like it was just showing the event as purchased. But what user has bought in that event? I want to know that. So please add that detail as well.✅

9. In user management settings tab in the section direct administrative message so please in the select channel option we have two of three options for now both email and push please remove that option we will have the separate email and push option and when I'm trying to send the notification to particular user I can't able to do that. So please review that and please fix it. ✅
 
10. And dashboard there are lots of mistakes like we in the top chips custom range at glance in the second chip, boost driving. So we I have already told we are not using boost, we are using supercharge, but still, it was boost mentioned there. And when the female signups I can see in the custom range when I'm selected like 90 days, so 3.5k female sign-up was there, but the percentage was showing 0.00%. And when I'm tapping on it like it was showing no user data found and also the user flagged also showing the 0% and it was in the red color. ✅

11. And for ghost rate, ghosting rates, I have already told you like we need to put the logic like the user which didn't use the app from last two month will count as the ghosting ghosted user but I don't know why you have used 20% match it with no response is the ghosting rate. So please fix that logic as well. ✅

12. And dashboard what is this match liquidity is about like we are seeing the matches 187 and unmatches below that I can see 9686 swipes so what is this about? ✅
- Match Liquidity is a key health metric for dating apps. It measures how effectively the active swiping on the platform translates into successful matches.

• How it's calculated: (Matches formed / Total likes and superlikes cast) * 100
• In your case: Out of 9,686 swipes cast in the period, 187 matches were successfully formed. This gives a match liquidity of 1.9%.
• Why it matters: It shows matching efficiency. A higher percentage means swiping users are having a better experience and matching successfully. ✅

13. In dashboard we have the range selector so in that we need to fix like only in the custom range we should have the apply filter option as like we can see today, yesterday, 7days, thirty days, ninety days So whenever we tap on it, the filter should directly applied without any without any button interfa interference. ✅

14. And in dashboard conversion funnel is static like the details was not changing at all ✅

15. And how in dashboard how this gender ratio is working? Like in 23 May I can see one female signup was there and zero male signup was will be there. But in gender ratio it was showing 66 colon, 34 female. So 66 male percentage 34 is female percentage, but we have one female sign up 0 male sign sign up. So how it can be possible that it has the male has 66% ratio. ✅

16. In fake profile tab, we should have the gender filter and the plan filter, like which user is pro and free. We can have the same filter as we are having in the user management. ✅

17. In profile reports we have to remove the s the new status which we are showing in the status column. It should be only in the filter like which we are using in the user management last 24 hr it should be like that and also we have the separate filter for the priority because currently we are integrating the high priority in the same filter so it should be in different filter and also when we remove the new tag new filter, so it should be removed from the top filter as well and then the left side profile report we are showing the numbers of new reports. So it should be merged with the pending report and it should show the number there and it should have the logic like if the report is less than 5 it should show in the teal color and if report is less than like greater than 5 5 till 20 reports so it should show in the orange color and if report is 25 plus it should it will be shown in the red color. So I will discuss that in the meeting and so yeah. ✅

18. In reported profile when we are having the resolve filter, it should show the recently resolved reports on the top, not according to the last reported date. Okay? ✅

19. In subscription section, so we are seeing 6 cards on the top, so we need to swipe today revenue card with the consumable revenue card, and when we are selecting 90 days, so today consumable card today revenue data is not updating, it was only showing the today's data, which was not good because we are using filters so it should be updated according to the filters. ✅

20. In subscription dashboard we are showing the milestone program card. Just below that we are showing currently at 45 user A. So why we are showing that A and after dot that a we have the dot and 955 to go. So why we are showing that?  I can see the same problem in top selling product as well ✅

21. In revenue trend we I can see like all consumable and all subscription both the one month subscription and three month subscription color is have very minor different it should have the different colours so please differentiate the colors between one month and three month subscription and same for consumable superkin and supercharge

22. In plant distribution in subscription dashboard we like we are showing that one month premium and we are showing 11 then percentage. So after 11:00 we should show users.

23. In managed subscri subscriber I can see that the platform when we are giving it from platform the plan was showing monthly but when we are buying it from Apple Store on Play Store it was showing one month plan so from when we are granting it from the admin it should sh have the same enum one month or three months not not it would it should not never show the monthly enum

24. In manage subscriber, we have few filters like plant type filters. In plant type, we have monthly filter and quarterly and yearly filter, but we don't have this type of plan, so why we are showing this type of plants in the filters

25. In subscription products please add the dollar sign just before the price like dollar sign then $9 and also in the table header we are showing SYS badge. I have already told remove that SYS option and we will just have the badge. So please remove SYSBage.

26. And when we are adding any product in the subscription, I have told you to add that info icon so admin won't confuse that where this badge was showing the subtitle was using, they have the clear idea where it was.

27. In the transaction history again in the product column I can see the boost it should change to the supercharge and also I can see the different different enum as a as well as well monthly manual monthly and admin granted, admin consumer granted, extension. So, what is it all about? I just want to know that.

28. And as we have introduced the grace period and the introductory offer or not, like the user can claim that or not

29. Also in the transaction history we need to work on the filter like both the event type filter and types of items was combined together they should have the different filters and also when I'm tapping on the cancel filter, it was showing me the failed payment. So it should have the fail tag, not cancel.

30. In the notification sending so when I'm trying to send the push notification there was no option to send the push notification to all the user like I can see the different options the paid user and free user but I don't have any option to when I want to send the push notification to all the app users.

31. Push notification is not working, app is not receiving any notification

32. In support ticket section, like can you explain me the difference between open and in progress status of that support ticket

33. Admin can't able to update its own profile. And there is lone no no limit for updating the contact number 

34. In settings still I can see email ad storage, so they are working or not, I just want to know that.

35. In the giveaway while we are editing the price like I can remove the supporting price and it sho it can be 4 price but still I can able to save the save that the prizes it should not be like that. So it should have the minimum 5 prices until then the button should be disabled. And if there was no changes to made in the price, the say button should be disabled. 

36. And in the giveaway we can able to create the campaign of the previous date as well. It should not be like that the past date that the admin can't able to create the campaign of the previous dates

37. In app I can see the super like count is different and supercharged like count is different for a particular Rajat 6260 user. Like the super like is 19 and supercharge is 14, but in the admin like in the user details I can see the 10 super like and 11 supercharge it should not calculating the admin granted like we are gra granting the free like it was not calculating the subscription super keys and supercharge so please calculate whatever the amount like the user has a premium membership and they had bought consumables as well. So it should show the sum of bo both of them.