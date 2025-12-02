# GRND Workout Sharing - Complete Setup Guide

## ✅ What's Been Done

1. ✅ Created landing page HTML with workout preview
2. ✅ Configured deep linking in app (scheme: `grnd://`)
3. ✅ Added deep link handling in App.js
4. ✅ Updated share function in WorkoutBuilderScreen
5. ✅ Initialized git repository

---

## 📋 Next Steps (You Need To Do)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `grnd-workout-share`
3. Make it **Public** (required for GitHub Pages)
4. DO NOT initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Push Code to GitHub

Run these commands in PowerShell:

```powershell
cd "C:\Users\yalty\Desktop\grnd-workout-share"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/grnd-workout-share.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username!**

### Step 3: Enable GitHub Pages

1. Go to your repo: `https://github.com/YOUR_GITHUB_USERNAME/grnd-workout-share`
2. Click **Settings** tab
3. Scroll down to **Pages** (in left sidebar)
4. Under "Source", select: **Branch: main**, **Folder: / (root)**
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your page will be live at: `https://YOUR_GITHUB_USERNAME.github.io/grnd-workout-share`

### Step 4: Update App Configuration

After you know your GitHub username, update these files:

#### File 1: `app.json` (line 20 and 37)

Replace `yourusername` with your GitHub username:

```json
"associatedDomains": ["applinks:YOUR_USERNAME.github.io"]
```

```json
"host": "YOUR_USERNAME.github.io"
```

#### File 2: `WorkoutBuilderScreen.js` (line 407)

Replace `yourusername` with your GitHub username:

```javascript
const shareUrl = `https://YOUR_USERNAME.github.io/grnd-workout-share?id=${result.shareId}`;
```

### Step 5: Add Backend Endpoint

You need to add these two endpoints to your Render backend:

#### Endpoint 1: Save Shared Workout (POST)

```
POST https://fitness-database-postgres.onrender.com/api/share-workout
```

**Request Body:**
```json
{
  "name": "برنامج 3 أيام",
  "days": 3,
  "exerciseCount": 15,
  "muscleCount": 8,
  "workouts": [...],
  "userEmail": "user@example.com",
  "createdAt": "2025-12-02T..."
}
```

**Response:**
```json
{
  "shareId": "ABC123DEF"
}
```

#### Endpoint 2: Get Shared Workout (GET)

```
GET https://fitness-database-postgres.onrender.com/api/shared-workout/:id
```

**Response:**
```json
{
  "name": "برنامج 3 أيام",
  "days": 3,
  "exerciseCount": 15,
  "muscleCount": 8,
  "workouts": [...]
}
```

---

## 🔧 Backend Implementation Example (Node.js/Express)

Add this to your Render backend:

```javascript
// Store shared workouts in memory (or use database)
const sharedWorkouts = new Map();

// Generate random share ID
function generateShareId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// POST /api/share-workout
app.post('/api/share-workout', (req, res) => {
  const workoutData = req.body;
  const shareId = generateShareId();

  // Store workout data
  sharedWorkouts.set(shareId, workoutData);

  res.json({ shareId });
});

// GET /api/shared-workout/:id
app.get('/api/shared-workout/:id', (req, res) => {
  const { id } = req.params;
  const workout = sharedWorkouts.get(id);

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  res.json(workout);
});
```

**For production, use a real database instead of `Map()`!**

---

## 🧪 Testing the Flow

### Test 1: Share Workout

1. Open app
2. Go to Workout Builder
3. Create a workout with some exercises
4. Tap the share button (📤)
5. You should see a share dialog with a link like:
   ```
   https://YOUR_USERNAME.github.io/grnd-workout-share?id=ABC123
   ```

### Test 2: Open Link (Without App)

1. Copy the link from step 5
2. Open it in a browser
3. You should see:
   - Workout name and stats
   - "Open in GRND App" button
   - Google Play / App Store buttons

### Test 3: Deep Link (With App Installed)

1. With app installed, click the link again
2. App should open automatically
3. Alert should show: "تم استلام التمرين"
4. Workout data is saved to AsyncStorage

---

## 🐛 Troubleshooting

### Deep link not working?

**Android:**
- Run: `npx expo prebuild`
- Rebuild the app: `npx expo run:android`

**iOS:**
- Deep links work in production builds, not in Expo Go
- You need to create a development build

### Landing page shows 404?

- Make sure GitHub Pages is enabled
- Check that `index.html` is in the root of the repo
- Wait 2-3 minutes after pushing for deployment

### Backend endpoint not found?

- Make sure you added the routes to your Render backend
- Test the endpoint with Postman first
- Check backend logs on Render dashboard

---

## 📱 Store Links (Update Later)

When you publish the app, update these in `index.html` (lines 198-199):

```javascript
document.getElementById('playStoreBtn').href = 'YOUR_PLAY_STORE_URL';
document.getElementById('appStoreBtn').href = 'YOUR_APP_STORE_URL';
```

---

## 🎉 You're Done!

The workout sharing system is ready. When you complete all steps above, users will be able to:

1. Share workouts with a single tap
2. Recipients click the link
3. If app installed → Opens directly to workout
4. If not installed → Shows download buttons
5. After install → Can still access the shared workout

**Any questions? Check the troubleshooting section or review the code comments!**
