# Google Analytics 4 Setup Guide

## What is Google Analytics?
Google Analytics is a **free** web analytics service that tracks and reports website traffic. It provides valuable insights about your visitors, their behavior, and how they interact with your portfolio.

## Step-by-Step Setup Instructions

### 1. Create a Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Get started"
4. Set up your account:
   - **Account name**: "Ezekiel Obeisun Portfolio"
   - **Property name**: "Portfolio Website"
   - **Reporting time zone**: Choose your timezone
   - **Currency**: USD (or your preferred currency)

### 2. Set up Data Stream
1. Choose "Web" as the platform
2. Enter your website URL: `https://nerdpioneer.github.io/academic-portfolio-template/`
3. Enter stream name: "Portfolio Main Site"
4. Click "Create stream"

### 3. Get Your Measurement ID
After creating the stream, you'll see a **Measurement ID** that looks like: `G-XXXXXXXXXX`

### 4. Update Your Website Code
1. Open your `index.html` file
2. Find the line that says `GA_MEASUREMENT_ID` (appears twice)
3. Replace **both instances** of `GA_MEASUREMENT_ID` with your actual Measurement ID

**Example:**
```html
<!-- Replace this -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- With this (using your actual ID) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**And also replace:**
```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
    // Replace with:
gtag('config', 'G-XXXXXXXXXX', {
```

### 5. Deploy Your Changes
After updating the Measurement ID:
1. Commit your changes to Git
2. Push to GitHub
3. Your GitHub Pages site will automatically update

### 6. Verify Installation
1. Visit your live website
2. Go back to Google Analytics
3. Look for "Real-time" in the left sidebar
4. You should see your visit appear within a few minutes

## What You'll Be Able to Track

### Visitor Analytics
- **Page views**: Which pages are most popular
- **Unique visitors**: How many different people visit
- **Session duration**: How long people stay
- **Bounce rate**: Percentage of single-page visits

### Traffic Sources
- **Organic search**: Visitors from Google, Bing, etc.
- **Direct traffic**: People typing your URL directly
- **Referral traffic**: Visitors from other websites
- **Social media**: Traffic from LinkedIn, Twitter, etc.

### User Behavior
- **Demographics**: Age and gender (when available)
- **Geographic data**: Where your visitors are located
- **Device information**: Desktop vs mobile usage
- **Popular content**: Which sections get the most attention

### Recruitment Insights
- **Career page performance**: Track interest in your projects
- **Resume downloads**: Monitor if people download your resume
- **Contact form interactions**: See engagement with contact methods
- **Study Mode usage**: Track which recruiters use your focus feature

## Privacy Considerations
Google Analytics is configured to:
- ✅ Respect user privacy
- ✅ Comply with GDPR requirements
- ✅ Use anonymous IP addresses
- ✅ Not track personally identifiable information

## Cost
Google Analytics 4 is **completely free** with generous limits:
- Up to 10 million events per month
- Up to 25 million sessions per month
- 14 months of data retention

Perfect for a portfolio website!

## Next Steps After Setup
1. Set up **Goals** to track specific actions (like project clicks)
2. Create **Custom Events** for Study Mode interactions
3. Set up **Audience Segments** to understand different visitor types
4. Configure **Email Reports** for weekly analytics summaries

## Need Help?
If you encounter any issues:
1. Check the browser console for errors
2. Use Google Analytics Debug Mode
3. Verify your Measurement ID is correct
4. Make sure your site is live and accessible

---

**Remember**: Replace `GA_MEASUREMENT_ID` with your actual Google Analytics Measurement ID in `index.html`!
