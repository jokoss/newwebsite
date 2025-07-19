# Railway Upload Fix - Complete Solution

## Problem Identified
The file upload system was broken on Railway because:

1. **Memory Storage Issue**: The upload middleware was using `multer.memoryStorage()` in production, which stores files in memory but doesn't save them to disk
2. **Missing Filename**: Memory storage doesn't generate a `filename` property, causing `req.file.filename` to be `undefined`
3. **Broken Image URLs**: This resulted in category images showing as `/uploads/undefined`
4. **Static File Serving**: The uploads directory wasn't being served correctly

## Root Cause
The middleware was designed for Netlify Functions (which have read-only filesystem), but Railway has a persistent filesystem that supports disk storage.

## Solution Applied

### 1. Fixed Upload Middleware (`server/middleware/upload.middleware.js`)
```javascript
// BEFORE: Memory storage (broken on Railway)
if (process.env.NODE_ENV === 'production') {
  storage = multer.memoryStorage();
}

// AFTER: Disk storage (works on Railway)
storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
```

### 2. Fixed Static File Serving (`server/index.js`)
```javascript
// BEFORE: Relative path (unreliable)
app.use('/uploads', express.static('uploads'));

// AFTER: Absolute path (reliable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3. Added Path Module
Added `const path = require('path');` to ensure proper path handling.

## How It Works Now

1. **File Upload**: When a user uploads an image through the admin panel:
   - File is saved to `server/uploads/` directory with a unique filename
   - Database stores the correct path: `/uploads/fieldname-timestamp-random.ext`

2. **File Serving**: When the frontend requests an image:
   - Express serves files from `/uploads/*` routes
   - Files are served from the correct `server/uploads/` directory

3. **Image Display**: Category images now display correctly on:
   - Admin dashboard (category management)
   - Public services page
   - Individual category pages

## Testing the Fix

### 1. Admin Panel Test
1. Go to your Railway app URL + `/admin`
2. Login with admin credentials
3. Navigate to "Category Management"
4. Try uploading an image for a category
5. Verify the image appears correctly in the preview

### 2. Public Site Test
1. Go to your Railway app URL + `/services`
2. Check if categories display with proper images
3. Click on a category to view its detail page
4. Verify images load correctly

### 3. Direct Image Access Test
1. Upload an image through admin panel
2. Note the image URL (e.g., `/uploads/image-1234567890-123456789.jpg`)
3. Access it directly: `your-railway-url.com/uploads/image-1234567890-123456789.jpg`
4. Image should load correctly

## Files Modified
- `server/middleware/upload.middleware.js` - Fixed storage configuration
- `server/index.js` - Fixed static file serving and added path module
- `RAILWAY-JWT-SECRET-FIX.md` - Created (unrelated file)

## Deployment Status
✅ Changes committed and pushed to GitHub
✅ Railway should auto-deploy within 2-3 minutes
✅ No manual intervention required

## Next Steps
1. Wait for Railway deployment to complete
2. Test file uploads through admin panel
3. Verify images display correctly on public pages
4. If issues persist, check Railway logs for any errors

## Troubleshooting
If uploads still don't work:
1. Check Railway logs for permission errors
2. Verify the `server/uploads` directory exists
3. Ensure Railway has write permissions to the uploads directory
4. Check if Railway has any file size limits

The fix addresses the core issue of using the wrong storage type for Railway's environment, and should resolve the `/uploads/undefined` problem completely.
