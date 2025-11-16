# 🔌 Frontend-Backend Connection Test Guide

## ✅ Quick Verification Checklist

### Step 1: Verify Both Servers Are Running

**Backend Check:**
- Open: http://localhost:5000/api/health
- Should show: `{"status": "healthy", "timestamp": "..."}`
- ✅ If you see this → Backend is running

**Frontend Check:**
- Open: http://localhost:8000
- Should show: Your website homepage
- ✅ If you see this → Frontend is running

---

### Step 2: Test Connection via Browser Console

1. **Open your website:** http://localhost:8000
2. **Press F12** to open Developer Tools
3. **Click the "Console" tab**
4. **Paste and run this command:**

```javascript
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ BACKEND CONNECTED!', data);
    alert('✅ Frontend and Backend are connected!');
  })
  .catch(err => {
    console.error('❌ CONNECTION FAILED:', err);
    alert('❌ Connection failed. Check if backend is running.');
  });
```

**Expected Result:**
- ✅ Success message in console + alert popup
- ❌ Error message if connection failed

---

### Step 3: Test Order Creation (Full Integration Test)

1. **In the same Console tab, paste this:**

```javascript
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test-user',
    items: [{ 
      id: '1', 
      name: 'Test Product', 
      price: 999,
      img: 'test.jpg',
      time: new Date().toISOString()
    }],
    total: 999,
    address: 'Test Address',
    phone: '1234567890',
    paymentMethod: 'COD'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ ORDER CREATED:', data);
    if (data.id) {
      alert('✅ Connection verified! Order ID: ' + data.id);
    }
  })
  .catch(err => {
    console.error('❌ ORDER FAILED:', err);
    alert('❌ Order creation failed. Check backend.');
  });
```

**Expected Result:**
- ✅ Console shows order data with an `id` field
- ✅ Alert shows success message with order ID
- ❌ Error if something went wrong

---

### Step 4: View Network Requests (Visual Verification)

1. **In Developer Tools, click the "Network" tab**
2. **Clear the network log** (click the 🚫 icon or right-click → Clear)
3. **Run the order creation command again** (from Step 3)
4. **Look for these requests:**

   - ✅ `health` or `api/health` → Status: **200**
   - ✅ `orders` or `api/orders` → Status: **201** (or 200)
   - ✅ Request URL shows: `http://localhost:5000/api/...`

5. **Click on the `orders` request to see details:**
   - **Headers tab:** Should show `Access-Control-Allow-Origin: *`
   - **Payload tab:** Shows the data you sent
   - **Response tab:** Shows the order ID and message

---

### Step 5: Test from Your Actual Website

1. **Navigate to a product page** (e.g., http://localhost:8000/box1.html)
2. **Click on an "Order" button** for any product
3. **Fill in the order form** on the order.html page
4. **Click "Confirm Order"**
5. **Check the Network tab** - you should see a POST request to `/api/orders`

---

## 🎯 Connection Status Indicators

### ✅ **CONNECTED** - All Good!
- Health check returns success
- Order creation works
- Network tab shows successful API calls
- No CORS errors in console

### ❌ **NOT CONNECTED** - Issues to Check

**If you see "Failed to fetch":**
- Backend might not be running
- Check: http://localhost:5000/api/health in a new tab
- Start backend: `cd backend` → `python app.py`

**If you see CORS errors:**
- Backend CORS might not be configured
- Check `backend/app.py` has `CORS(app)` enabled

**If you see 404 errors:**
- API endpoint might be wrong
- Check the URL matches: `http://localhost:5000/api/...`

**If you see 500 errors:**
- Backend has an error
- Check backend terminal for error messages
- Verify Firebase is configured correctly

---

## 📊 Quick Test Summary

| Test | Command | Expected Result |
|------|---------|------------------|
| Backend Health | `fetch('http://localhost:5000/api/health')` | Status 200, JSON response |
| Create Order | `fetch('http://localhost:5000/api/orders', {...})` | Status 201, Order ID returned |
| Network Tab | Check Network tab after requests | See API calls with correct status codes |

---

## 🎉 Success Criteria

Your frontend and backend are **successfully connected** if:

1. ✅ Health check returns success
2. ✅ Order creation returns an order ID
3. ✅ Network tab shows successful API requests
4. ✅ No errors in browser console
5. ✅ CORS headers are present in response

---

## 🛠️ Troubleshooting

**Backend not starting?**
```bash
cd backend
python app.py
```

**Frontend not starting?**
```bash
cd frontend
python -m http.server 8000
```

**Firebase errors?**
- Check `serviceAccountKey.json` exists in backend folder
- Verify Firebase project is set up correctly

**Port already in use?**
- Change port in `app.py`: `app.run(port=5001)` (or any other port)
- Update `API_BASE` in `frontend/js/main.js` to match

