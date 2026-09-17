# Univa — Transportation 2100

## 1. Project Overview

**Univa** is a futuristic, accessible, and intelligent transportation platform designed for the year **2100**.

The application connects different forms of future transportation into one simple journey-planning experience. Users can search for a destination, receive an optimized journey plan, follow their journey in real time, transfer between different transportation systems, and receive a journey summary when they arrive.

The main goal is to make advanced transportation technology feel **simple, accessible, reliable, and easy to understand for everyone**, regardless of age or technical experience.

Univa should not feel like a complicated futuristic dashboard. It should feel like a **clean, modern transportation app that happens to use advanced 2100 technology**.

---

# 2. Core Concept

The user should be able to complete the following journey:

**Open Univa → Search destination → Select route → Start journey → Follow live route → Transfer between vehicles → Arrive → Give feedback**

Example:

> Current Location
> ↓
> Autonomous Bus
> ↓
> SkyRail
> ↓
> Smart Road
> ↓
> Destination

Univa combines multiple transportation technologies into one journey.

Possible transportation modes include:

* Autonomous buses
* SkyRail
* Smart roads
* Autonomous vehicles
* Future trains
* Air transportation
* Walking connections
* Other future public transportation

---

# 3. Target Users

Univa should be designed for:

* Students
* Workers
* Elderly users
* Tourists
* People with disabilities
* Users with limited technology experience
* Daily commuters

The interface must therefore prioritize:

* Clear typography
* Large touch targets
* Simple navigation
* High readability
* Clear icons
* Minimal unnecessary information
* Accessibility
* Voice interaction

---

# 4. Brand Identity

## Brand Name

**Univa**

The name represents a unified transportation ecosystem where different transportation systems work together.

## Primary Color

**Deep Navy**

`#192841`

This is the main Univa brand color.

Use it for:

* Primary buttons
* Important headings
* Navigation elements
* Active states
* Route highlights
* Brand elements

## Supporting Colors

### Background

`#F7F9FC`

Use this as the primary application background.

### White

`#FFFFFF`

Use for:

* Cards
* Input fields
* Modal surfaces
* Content containers

### Secondary Text

`#64748B`

Use for supporting information and descriptions.

### Border

`#E2E8F0`

Use for subtle borders and dividers.

### Status Colors

Success:

`#22C55E`

Warning:

`#F59E0B`

Error:

`#EF4444`

Do not overuse status colors. They should only communicate meaningful states.

---

# 5. Design Style

The UI should be:

* Modern
* Minimal
* Clean
* Futuristic
* Professional
* Accessible
* Spacious
* Easy to understand

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Excessive animations
* Too many colors
* Complex futuristic dashboards
* Tiny text
* Overloaded maps
* Unnecessary decorative elements

The design should look like a **real transportation product from 2100**, not a science-fiction movie interface.

---

# 6. Application Structure

The main application flow contains the following screens:

1. Login
2. Registration
3. Home
4. Destination / Route Preferences
5. Journey Plan
6. Live Journey
7. Transfer Alert
8. Journey Complete
9. Feedback

---

# 7. Login Screen

## Purpose

Allow existing users to securely access their Univa account.

## UI

Top:

* Univa logo
* Short tagline

Example:

**Move smarter. Arrive better.**

Form:

### Email / Phone Number

Placeholder:

`Enter email or phone number`

### Password

Placeholder:

`Enter your password`

Include:

* Show/hide password icon
* Forgot Password link

Primary button:

**Login**

Bottom:

> Don't have an account? **Register**

## Validation

The interface should handle:

* Empty fields
* Invalid email/phone
* Incorrect password
* Loading state
* Login error

---

# 8. Registration Screen

## Purpose

Allow a new user to create a Univa account.

## Fields

### Profile Photo

Optional.

Button:

`+ Add photo`

### Full Name

`Enter your full name`

### Email / Phone

`Enter email or phone number`

### Password

`Create a password`

### Confirm Password

`Confirm your password`

Display password requirements:

* At least 8 characters
* One number
* One special character

Agreement:

☐ I agree to the Terms of Service and Privacy Policy

Primary CTA:

**Create Account**

Bottom:

> Already have an account? **Login**

---

# 9. Home Screen

The Home screen is the main dashboard.

## Top Navigation

Left:

**Univa logo**

Right:

* Notification icon
* Profile/avatar

Location section:

📍 **Current Location**

Example:

`KDU, Ratmalana`

---

## Main Destination Search

Large prominent search component:

### Where do you want to go?

Search field:

`Search places, stations, universities...`

Include search icon.

---

# 10. Voice Feature — "Tell Univa"

Univa should have a prominent voice interaction feature.

Button:

🎙 **Tell Univa**

The user can speak naturally.

Example:

> "Take me to the airport."

Other possible commands:

> "How long will it take?"

> "Where is my next transfer?"

> "Find an accessible route."

The voice feature should be visually simple and easy to access.

---

# 11. Recent Destinations

Display frequently/recently visited locations.

Example cards:

### University

🏫

### Home

🏠

### Work

💼

### Airport

✈️

Each card should contain:

* Icon
* Location name
* Optional address

---

# 12. Saved Places

Section:

**Saved Places**

Example:

* Home
* Work
* University
* Favorite location

Include:

**+ Add place**

---

# 13. Destination / Route Preferences Screen

## Purpose

Allow the user to define the starting location and destination.

Header:

**Plan your Journey**

Back button at top.

---

## From

📍 Current Location

Example:

`KDU, Ratmalana`

Button:

**Change**

---

## To

Search field:

`Where do you want to go?`

---

## Map Preview

Display a simplified map showing:

* Starting location
* Destination
* Possible route
* Transportation connections

The map should not dominate the entire interface.

---

# 14. Route Preferences

Allow users to select how they want to travel.

Possible preferences:

### Fastest

⚡

Prioritize travel time.

### Eco-Friendly

🌱

Prioritize lower environmental impact.

### Most Accessible

♿

Prioritize accessibility.

### Lowest Cost

💰

Prioritize affordability.

### Less Walking

🚶

Reduce walking distance.

The user can select one preference.

Primary CTA:

**Find Routes**

---

# 15. Journey Plan Screen

## Purpose

Show the user the planned journey before starting.

Header:

**Your Journey**

Display:

### From

Current Location

↓

### To

Destination

---

# 16. Journey Summary

Display a summary card.

### Arrival

**10:42 AM**

### Journey Time

**38 min**

### Transfers

**2**

### Walking

**6 min**

---

# 17. Journey Timeline

Display the complete journey visually.

Example:

**09:58 AM**

📍 Current Location

↓

🚶 Walk — 3 min

↓

**10:01 AM**

🚌 Autonomous Bus 245

↓

**10:16 AM**

🔄 Central Station

Transfer

↓

**10:28 AM**

🚄 SkyRail

↓

**10:34 AM**

🛣 Smart Road

↓

**10:42 AM**

📍 Destination

---

# 18. Transport Information

Each transportation segment should clearly identify:

* Transport type
* Vehicle/service
* Departure time
* Arrival time
* Duration
* Transfer location

Example:

### Autonomous Bus

Bus 245

`10:01 AM → 10:16 AM`

15 min

---

### SkyRail

Line 02

`10:18 AM → 10:28 AM`

10 min

---

### Smart Road

Autonomous vehicle

`10:34 AM → 10:42 AM`

8 min

---

Primary CTA:

**Start Journey**

Secondary:

**View Other Routes**

---

# 19. Live Journey Screen

This is one of the most important screens.

Once the user selects **Start Journey**, Univa enters Live Journey mode.

## Header

**Your Journey**

Status:

🟢 **On Time**

---

# 20. Live Map

The map should occupy the main portion of the screen.

Show:

* Current user location
* Current vehicle
* Current route
* Completed route
* Remaining route
* Stops
* Transfer points
* Destination

Example:

```text
Current Location
       ↓
   🚌 Bus
       ↓
Central Station
       ↓
   🚄 SkyRail
       ↓
Destination
```

The current location should update as the user travels.

---

# 21. Current Vehicle Card

Example:

### 🚌 Autonomous Bus 245

**You're on this vehicle**

`12 min remaining`

Additional information:

* Current stop
* Next stop
* Arrival time
* Vehicle status

---

# 22. Next Stop

Clearly display:

### Next Stop

**Central Station**

`2 stops away`

This information should be highly visible.

---

# 23. Journey Progress

Display journey progress visually.

Example:

```text
●━━━━━━●━━━━━━○━━━━━━○
Start   Bus    SkyRail  Destination
```

Completed sections should be visually different from upcoming sections.

---

# 24. Transfer Alert

When the user approaches a transfer point, show a clear alert.

Example:

## 🔄 Transfer Coming Up

**Change to SkyRail**

Get off at:

**Central Station**

`2 minutes`

The user should clearly understand:

* Where to get off
* What vehicle to take next
* When to transfer
* How far they need to walk

The alert should not cover the entire screen unnecessarily.

---

# 25. Voice Assistance During Journey

The **Tell Univa** button remains available during the journey.

Possible questions:

> "Where do I get off?"

> "How much longer?"

> "What's my next vehicle?"

> "Am I going the right way?"

> "Find an accessible alternative."

---

# 26. Journey Complete Screen

When the user reaches the destination:

Display a clear success state.

Large icon:

🎉

Heading:

# You've arrived!

Subtitle:

**Welcome to your destination.**

---

# 27. Journey Summary

Display:

### Total Journey

**42 min**

### Distance

**18.4 km**

### Transfers

**2**

### Walking

**6 min**

---

# 28. Transportation Used

Show the transportation modes used during the journey.

Example:

🚌 **Autonomous Bus**

↓

🚄 **SkyRail**

↓

🛣 **Smart Road**

Each should be represented as a simple visual card or timeline item.

---

# 29. Feedback

Heading:

### How was your journey?

Rating:

⭐ ⭐ ⭐ ⭐ ⭐

Allow the user to select 1–5 stars.

Optional text field:

`Tell us what we could improve`

Primary CTA:

**Done**

After pressing Done, return the user to the Home screen.

---

# 30. Accessibility Requirements

Accessibility is a major part of Univa.

The interface should support:

### Visual Accessibility

* High contrast
* Readable font sizes
* Clear hierarchy
* Do not rely only on color to communicate information
* Large buttons
* Clear icons with labels

### Motor Accessibility

* Large touch targets
* Simple interactions
* Avoid unnecessary gestures

### Cognitive Accessibility

* Simple language
* Clear instructions
* One major action per section
* Avoid overwhelming users with information

### Voice Accessibility

The **Tell Univa** feature should allow users to interact without typing.

### Accessible Journey Preference

Users should be able to select:

**Most Accessible**

This can prioritize:

* Step-free routes
* Elevators
* Accessible vehicles
* Reduced walking
* Accessible stations

---

# 31. Navigation

The initial prototype can use a simple navigation structure.

Main navigation:

**Home**

**Journeys**

**Saved**

**Profile**

During an active journey, the Live Journey screen should take priority over normal navigation.

---

# 32. Important UI Principles

Every screen should answer the user's immediate question.

For example:

Home:

> **Where do you want to go?**

Journey Plan:

> **How will I get there?**

Live Journey:

> **Where am I and what do I do next?**

Transfer:

> **Where do I change vehicles?**

Complete:

> **Did I arrive and how did my journey go?**

---

# 33. Prototype Data

For the UI prototype, real transportation APIs are not required.

Use realistic mock data.

Example journey:

**From:** KDU, Ratmalana

**To:** Bandaranaike International Airport

Journey:

1. Walk — 3 min
2. Autonomous Bus 245 — 15 min
3. Transfer at Central Station
4. SkyRail — 12 min
5. Smart Road — 8 min

Summary:

* Arrival: 10:42 AM
* Journey: 38–42 min
* Transfers: 2
* Walking: 6 min
* Distance: 18.4 km

The data should be structured so it can later be replaced by a real transportation API.

---

# 34. Design System

Create reusable components for:

* Buttons
* Input fields
* Search bars
* Cards
* Navigation bars
* Vehicle cards
* Journey timeline
* Map markers
* Status badges
* Transport icons
* Bottom sheets
* Alerts
* Modals
* Rating components
* Voice button

Primary button:

**#192841 background + white text**

Secondary button:

White background + `#192841` border/text

Application background:

**#F7F9FC**

Cards:

**#FFFFFF**

---

# 35. Responsive Design

The application should primarily be designed as a **mobile-first transportation application**.

It should work well on:

* Mobile phones
* Tablets

Use responsive layouts rather than fixed dimensions.

Maintain:

* Comfortable spacing
* Large touch targets
* Readable typography
* Consistent navigation

---

# 36. Development Goal

Build a functional frontend prototype of Univa.

The priority is:

1. Clean UI
2. Complete user flow
3. Realistic interactions
4. Accessibility
5. Responsive design
6. Reusable components
7. Easy future integration with real APIs

The prototype should allow a user to actually navigate through the complete journey:

**Login → Register → Home → Search → Select Destination → Route Preferences → Journey Plan → Start Journey → Live Journey → Transfer → Journey Complete → Feedback → Home**

The application should feel like one coherent product rather than a collection of unrelated screens.

## Final Product Vision

Univa should communicate this idea:

> **One platform. Every journey.**

Different transportation systems may operate independently, but Univa brings them together into one understandable journey for the user.

The technology should feel advanced, while the experience remains **simple, human, and accessible**.

