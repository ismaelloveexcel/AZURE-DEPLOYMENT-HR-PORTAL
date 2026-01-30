# HR Portal - Quick Start Guide

**For:** Ismael (Solo HR Admin, Abu Dhabi)  
**Date:** January 29, 2025  
**Status:** ✅ Ready to Use

---

## 🚀 5-Minute Quick Start

### Step 1: Access the Portal
```
URL: [Your deployed Azure URL]
```

### Step 2: First Login
- **Employee ID:** BAYN00008 (admin) or your employee ID
- **Password:** Date of birth (DDMMYYYY format, e.g., 15031990)
- **Action:** Change password when prompted

### Step 3: Explore Main Features
1. **Dashboard** - Overview of system status
2. **Employees** - View, add, edit, import employees
3. **Compliance** - See expiring documents (red = urgent!)
4. **Passes** - Generate employee/candidate passes
5. **Leave** - Process leave requests

---

## 📊 What's New (Enhanced UI)

### Modern Login Screen ✨
- Glass-morphism design with animated background
- Icon-enhanced input fields
- Smooth animations
- Clear first-time login instructions

### Enhanced Navigation Sidebar 🧭
- Your profile with avatar at top
- Color-coded role badge (Admin=Blue, HR=Amber)
- Quick sign-out button
- Active menu items highlighted with gradient

### Interactive Dashboard Cards 📈
- Hover effects (cards lift up)
- Trend indicators (↑ ↓)
- Click to view details
- Color-coded by importance

### Status Badges 🏷️
- **Green** = Active/Good
- **Amber** = Pending/Warning
- **Red** = Expired/Critical
- Consistent across entire app

---

## 💼 Common Tasks

### Import Employees from CSV
1. Go to **Employees** tab
2. Click **Upload CSV** button
3. Select your CSV file
4. Review import report
5. Done! ✅

**CSV Format Required:**
```csv
employee_id,name,email,department,job_title,nationality,gender,...
BAYN00001,John Doe,john@example.com,HR,Manager,UAE,Male,...
```

### Check Compliance Alerts
1. Go to **Compliance Alerts** tab
2. See grouped alerts:
   - **Red Section** = Already expired (urgent!)
   - **Amber Section** = Expiring in 7-30 days
   - **Green Section** = OK for now
3. Click on employee to see details
4. Export to CSV if needed

### Generate Employee Pass
1. Go to **Passes** tab
2. Fill in the form:
   - Select pass type (Employee/Candidate/Manager)
   - Enter employee details
   - Set validity dates
   - Choose access areas
3. Click **Generate Pass**
4. Pass appears with QR code
5. Print or export as PDF

### Process Leave Request
1. Employee submits leave request
2. You see it in **Leave Requests** section
3. Click **View Details**
4. Check dates and reason
5. Click **Approve** or **Reject**
6. Employee gets notified ✅

---

## 🎨 UI Components Reference

### Avatar
Shows user photo or initials (e.g., "John Doe" → "JD")  
**Colors:** Auto-generated based on name

### Status Badge
```
Active      = Green   (✅ Everything OK)
Pending     = Amber   (⏳ Waiting for action)
Expired     = Red     (❌ Urgent attention needed)
Warning     = Orange  (⚠️ Review needed)
```

### Dashboard Cards
```
Green   = Success metrics (total employees, active)
Amber   = Warning metrics (pending renewals)
Red     = Critical metrics (expired documents)
Blue    = Info metrics (system features)
```

---

## 🇦🇪 UAE Compliance Tracking

### Documents Tracked
- ✅ **Visa** (issue date, expiry, number)
- ✅ **Emirates ID** (number, expiry)
- ✅ **Medical Fitness** (date, expiry)
- ✅ **ILOE** (status, expiry)
- ✅ **Contract** (type, start, end dates)

### Alert Schedule
- **60 days before:** Early warning (green)
- **30 days before:** Attention needed (amber)
- **7 days before:** Urgent action (orange)
- **After expiry:** Critical issue (red)

### What to Do When Alert Shows
1. Click on employee name
2. Review document details
3. Prepare renewal paperwork
4. Update status after renewal
5. Alert disappears automatically ✅

---

## 🔧 Troubleshooting

### Login Issues
- ✅ Check employee ID spelling (e.g., BAYN00008)
- ✅ Password is date of birth: DDMMYYYY (e.g., 15031990)
- ✅ Clear browser cache if needed
- ✅ Try different browser

### CSV Import Fails
- ✅ Check CSV format matches template
- ✅ Ensure no special characters in data
- ✅ Check file encoding (UTF-8)
- ✅ Remove empty rows at end

### Page Won't Load
- ✅ Check internet connection
- ✅ Refresh page (Ctrl+F5 or Cmd+Shift+R)
- ✅ Clear browser cache
- ✅ Check browser console (F12) for errors

### Data Not Showing
- ✅ Check your role permissions (Admin/HR can see all)
- ✅ Refresh the page
- ✅ Check filter settings (e.g., "Active only")

---

## 📱 Mobile Access

### Responsive Design
- ✅ Works on tablets (iPad, Android tablets)
- ✅ Basic functionality on phones
- ✅ Best experience on desktop (Chrome, Edge, Safari)

### Mobile Tips
- Use landscape mode on phone for better view
- Dashboard cards stack vertically
- Tables scroll horizontally
- Forms adapt to screen size

---

## 🔐 Security Best Practices

### Password Management
1. ✅ Change default password immediately
2. ✅ Use strong password (mix of letters, numbers, symbols)
3. ✅ Don't share password with anyone
4. ✅ Change password every 90 days

### Data Protection
1. ✅ Always sign out when leaving desk
2. ✅ Don't share screen during video calls (salary data!)
3. ✅ Export data to CSV only when needed
4. ✅ Delete exported files after use

### Access Control
- **Admin:** Full access (all features)
- **HR:** Most features (not feature toggles)
- **Employee:** Limited (own data only)

---

## 💡 Pro Tips

### Keyboard Shortcuts
- **Ctrl+F** / **Cmd+F** - Search in page
- **Esc** - Close modal/popup
- **Tab** - Navigate form fields
- **Enter** - Submit form

### Efficiency Tips
1. **Use CSV import** for bulk employee updates
2. **Set compliance alerts** to email (if configured)
3. **Export data regularly** for backup
4. **Bookmark frequently used sections**

### Data Management
1. **Weekly:** Check compliance alerts
2. **Monthly:** Review pending leave requests
3. **Quarterly:** Export employee data backup
4. **Yearly:** Update contract expiry dates

---

## 📞 Getting Help

### Self-Service
1. **Documentation:** Check *.md files in repo
2. **Browser Console:** Press F12 to see errors
3. **Export Data:** CSV export for analysis

### Support Channels
- **Technical Issues:** Create GitHub issue
- **Feature Requests:** Discuss with team
- **Urgent Problems:** Contact IT support

### Useful Links
- **Azure Portal:** [portal.azure.com](https://portal.azure.com)
- **GitHub Repo:** AZURE-DEPLOYMENT-HR-PORTAL
- **Docs Folder:** `/docs` in repository

---

## 📊 Dashboard Metrics Explained

### Total Employees
Count of all employees in system (active + inactive)

### Active Employees
Currently employed staff (employment_status = 'Active')

### Pending Renewals
Documents expiring in next 30 days (visa, ID, medical, etc.)

### Features Enabled
System features that are turned on (see Settings)

### Compliance Alerts
Total urgent items needing attention (expired + expiring soon)

---

## 🎓 Training Resources

### First-Time Users
1. Watch system overview (if video available)
2. Try importing sample CSV (test data)
3. Generate test pass
4. Review compliance alerts
5. Process test leave request

### Advanced Features
1. **Bulk Operations:** CSV import/export
2. **Feature Toggles:** Enable/disable modules (admin only)
3. **Geofencing:** Attendance tracking by location
4. **Templates:** Document generation
5. **Nominations:** EOY performance reviews

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't:
1. **Don't share admin password** with anyone
2. **Don't delete employees** unless absolutely necessary (set to inactive instead)
3. **Don't ignore compliance alerts** (legal requirement in UAE!)
4. **Don't bypass approvals** (maintain audit trail)
5. **Don't export salary data** to unsecured locations

### ✅ Do:
1. **Do change password regularly**
2. **Do backup data monthly**
3. **Do check compliance weekly**
4. **Do document decisions** (audit trail)
5. **Do ask for help** when unsure

---

## 📅 Recommended Schedule

### Daily Tasks
- ⏰ Check dashboard for urgent alerts
- ⏰ Review new leave requests
- ⏰ Process pending approvals

### Weekly Tasks
- 📅 Review compliance alerts (Monday)
- 📅 Update employee records (as needed)
- 📅 Generate weekly reports (Friday)

### Monthly Tasks
- 📆 Export employee data backup (1st of month)
- 📆 Review pending renewals (mid-month)
- 📆 Update contract expiry dates (as needed)

---

## 🎉 You're Ready!

The HR Portal is designed to make your life easier. Start with the basics and explore features as you go.

**Key Takeaways:**
1. ✅ Login with employee ID + DOB password
2. ✅ Dashboard shows what needs attention
3. ✅ Red badges = urgent, green = OK
4. ✅ CSV import for bulk operations
5. ✅ Check compliance alerts weekly

**Questions?** Check the documentation or create a GitHub issue.

**Happy HR Managing! 🚀**

---

**Last Updated:** January 29, 2025  
**Version:** 1.0.0  
**For:** Baynunah HR Portal MVP
