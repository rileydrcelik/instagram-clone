# Vercel Deployment Setup Guide

## 1. Add Environment Variables to Vercel

Go to your Vercel project settings and add these environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyCcD91HZIRdphH2_VZ0WV6kgjPPMy3R558
VITE_FIREBASE_AUTH_DOMAIN=insta-clone-b8ccf.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=insta-clone-b8ccf
VITE_FIREBASE_STORAGE_BUCKET=insta-clone-b8ccf.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=331355228455
VITE_FIREBASE_APP_ID=1:331355228455:web:3f9e321236ac2c53834102
VITE_FIREBASE_MEASUREMENT_ID=G-8VRX13RT2Y
```

### How to add them:
1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable name and value
5. Make sure to select "Production", "Preview", and "Development" for each variable
6. Click "Save"

## 2. Add Vercel Domain to Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `insta-clone-b8ccf`
3. Go to "Authentication" → "Settings" → "Authorized domains"
4. Click "Add domain"
5. Add your Vercel domain (e.g., `your-app.vercel.app`)
6. Click "Add"

## 3. Redeploy Your App

After adding environment variables:
1. Go to your Vercel dashboard
2. Click on "Deployments"
3. Click the three dots on the latest deployment
4. Click "Redeploy"

OR just push a new commit to trigger a redeploy.

## Common Issues

### Google Sign-In Not Working
- Make sure your Vercel domain is added to Firebase Authorized Domains
- Check that all environment variables are set in Vercel
- Clear your browser cache and try again

### "can't access property 'user', l is undefined"
- This error has been fixed in the code with better null checks
- Redeploy after the fix to resolve this issue

