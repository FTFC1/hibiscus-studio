# 🔥 COMPREHENSIVE REQUIREMENTS TRACKER
## Stop Breaking Shit That Was Already Working

### 🎯 **CORE PRINCIPLE**: Every change must preserve existing functionality unless explicitly overridden

---

## 📱 **MOBILE UX REQUIREMENTS**

### **Mobile Table Responsiveness**
- ✅ **REQUIREMENT**: Tables must fit mobile screen width properly
- ❌ **CURRENT STATUS**: BROKEN - Table doesn't fit mobile screen
- 🔧 **ACTION NEEDED**: Fix table overflow on mobile

### **Mobile Preview Flow**
- ✅ **REQUIREMENT**: Single header on mobile (no duplicates)
- ✅ **STATUS**: FIXED - No more duplicate headers
- 📱 **FLOW**: Demo → Preview → PDF (3 taps max)

---

## 💰 **CALCULATION REQUIREMENTS**

### **Subtotal & Total Calculations**
- ✅ **REQUIREMENT**: Subtotal and Total must always calculate and display
- ❌ **CURRENT STATUS**: BROKEN - Shows ₦NaN instead of calculated values
- 🔧 **ACTION NEEDED**: Fix calculation logic immediately

### **Currency Formatting**
- ✅ **REQUIREMENT**: All currency must show as ₦X,XXX,XXX.XX format
- ✅ **REQUIREMENT**: No ₦NaN or undefined values ever

---

## 🏦 **DEFAULT SELECTIONS**

### **Bank Selection**
- ✅ **REQUIREMENT**: Always have ONE bank pre-selected by default
- ❌ **CURRENT STATUS**: BROKEN - No bank pre-selected
- 🔧 **ACTION NEEDED**: Set GTB as default bank selection

### **Prepared By Dropdown**
- ✅ **REQUIREMENT**: Dropdown with ONLY "Rita" and "Maryam" options
- ❌ **CURRENT STATUS**: BROKEN - Shows "Management" or other wrong options
- 🔧 **ACTION NEEDED**: Fix dropdown to show only Rita/Maryam

### **Approved By Dropdown**
- ✅ **REQUIREMENT**: Dropdown with "Joelle Haykal", "Gaurav Kaul", "Syam Abdukadir", "Omar Karameh"
- 🔧 **STATUS**: Needs verification

---

## 🚫 **TOAST/NOTIFICATION REQUIREMENTS**

### **Demo Mode**
- ✅ **REQUIREMENT**: Demo button should SILENTLY auto-fill (no toast)
- ✅ **STATUS**: FIXED - No more persistent toasts
- ✅ **REQUIREMENT**: Auto-trigger preview after demo load

---

## 📊 **DASHBOARD REQUIREMENTS**

### **Metrics Display**
- ✅ **REQUIREMENT**: Replace "Active/Expired" with "This Month" and "Average Value"
- ✅ **STATUS**: IMPLEMENTED

### **Preview Button**
- ✅ **REQUIREMENT**: Remove "Preview" button from dashboard
- ✅ **STATUS**: IMPLEMENTED

---

## 🎨 **UI/UX REQUIREMENTS**

### **Demo Button Styling**
- ✅ **REQUIREMENT**: Keep demo button but make it less intrusive
- ✅ **STATUS**: IMPLEMENTED

### **Smart Defaults**
- ✅ **REQUIREMENT**: Remember last-used "Prepared By" and "Approved By"
- ✅ **REQUIREMENT**: Auto-select bank, set minimum car price, date defaults
- 🔧 **STATUS**: Partially implemented

### **Field Clarity**
- ✅ **REQUIREMENT**: Clear distinction between editable vs non-editable fields
- ✅ **STATUS**: IMPLEMENTED - Auto-calculated fields marked

### **Discount Field**
- ✅ **REQUIREMENT**: Add discount field and include in total calculations
- 🔧 **STATUS**: Needs verification

### **Internal Notes**
- ✅ **REQUIREMENT**: Add simple internal notes field for PFI
- 🔧 **STATUS**: Needs implementation

---

## 📱 **RESPONSIVE DESIGN REQUIREMENTS**

### **Desktop Side-by-Side**
- ✅ **REQUIREMENT**: Desktop (≥1024px) shows form + preview side-by-side
- ✅ **STATUS**: IMPLEMENTED

### **Mobile Direct Flow**
- ✅ **REQUIREMENT**: Mobile (<1024px) goes directly to preview page
- ✅ **STATUS**: IMPLEMENTED

---

## 🔢 **DEMO DATA REQUIREMENTS**

### **Demo Values**
- ✅ **REQUIREMENT**: Demo should auto-fill with ₦30M+ values (not ₦22M)
- ✅ **STATUS**: FIXED - Now uses ₦30M values

### **Minimum Price Text**
- ✅ **REQUIREMENT**: Remove "(Minimum: ₦30,000,000.00)" text
- ✅ **STATUS**: FIXED

---

## ⚠️ **CRITICAL BUGS TO FIX IMMEDIATELY**

1. **❌ CALCULATIONS BROKEN**: Subtotal/Total showing ₦NaN
2. **❌ MOBILE TABLE**: Doesn't fit screen width
3. **❌ BANK SELECTION**: No default bank selected
4. **❌ PREPARED BY**: Wrong dropdown options

---

## 🔄 **TESTING CHECKLIST**

Before marking ANY feature as complete:

### **Mobile Testing** (< 1024px)
- [ ] Table fits screen width
- [ ] Single header only
- [ ] Calculations show proper currency
- [ ] All buttons thumb-accessible

### **Desktop Testing** (≥ 1024px)
- [ ] Side-by-side view works
- [ ] All calculations correct
- [ ] Dropdowns have correct options

### **Demo Flow Testing**
- [ ] Demo button fills ₦30M+ values
- [ ] No persistent toasts
- [ ] Auto-triggers preview
- [ ] PDF downloads correctly

### **Default Values Testing**
- [ ] Bank pre-selected (GTB)
- [ ] Prepared By shows Rita/Maryam only
- [ ] Approved By shows correct 4 options

---

## 🚨 **ANTI-REGRESSION RULES**

1. **NEVER** remove working functionality without explicit approval
2. **ALWAYS** test mobile + desktop before committing
3. **ALWAYS** verify calculations work before shipping
4. **ALWAYS** check default selections are correct
5. **NO** changes to core UX flow without discussion

---

## 📝 **CHANGE LOG**

### Recent Changes That Broke Things:
- Fixed duplicate headers ✅
- BROKE calculations showing ₦NaN ❌
- BROKE mobile table width ❌
- BROKE default bank selection ❌

### Next Actions:
1. Fix calculation logic
2. Fix mobile table responsiveness  
3. Set default bank selection
4. Verify dropdown options

---

**📞 ESCALATION**: If any of these requirements are unclear or conflicting, STOP and ask for clarification rather than guessing. 