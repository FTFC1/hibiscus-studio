# 🔥 COMPREHENSIVE REQUIREMENTS TRACKER
## Stop Breaking Shit That Was Already Working

### 🎯 **CORE PRINCIPLE**: Every change must preserve existing functionality unless explicitly overridden

---

## 📱 **MOBILE UX REQUIREMENTS**

### **Mobile Table Responsiveness**
- ✅ **REQUIREMENT**: Tables must fit mobile screen width properly
- ✅ **STATUS**: FIXED - Table now fits mobile screens (min-width: 280px)
- 🎯 **COMPLETED**: Changed table min-width from 600px to 280px on mobile

### **Mobile Preview Flow**
- ✅ **REQUIREMENT**: Single header on mobile (no duplicates)
- ✅ **STATUS**: FIXED - No more duplicate headers
- 📱 **FLOW**: Demo → Preview → PDF (3 taps max)

---

## 💰 **CALCULATION REQUIREMENTS**

### **Subtotal & Total Calculations**
- ✅ **REQUIREMENT**: Subtotal and Total must always calculate and display
- ✅ **STATUS**: FIXED - Shows proper currency calculations
- 🎯 **COMPLETED**: Fixed demo data calculation + formatCurrency safety checks

### **Currency Formatting**
- ✅ **REQUIREMENT**: All currency must show as ₦X,XXX,XXX.XX format
- ✅ **REQUIREMENT**: No ₦NaN or undefined values ever

---

## 🏦 **DEFAULT SELECTIONS**

### **Bank Selection**
- ✅ **REQUIREMENT**: Always have ONE bank pre-selected by default
- ✅ **STATUS**: FIXED - GTB is now pre-selected by default
- 🎯 **COMPLETED**: Updated getLastUsedValues() to default to GTB

### **Prepared By Dropdown**
- ✅ **REQUIREMENT**: Dropdown with ONLY "Rita" and "Maryam" options
- ✅ **STATUS**: FIXED - Proper dropdown with Rita/Maryam options only
- 🎯 **COMPLETED**: Converted from readonly input to Select component

### **Approved By Dropdown**
- ✅ **REQUIREMENT**: Dropdown with "Joelle Haykal", "Gaurav Kaul", "Syam Abdukadir", "Omar Karameh"
- ✅ **STATUS**: FIXED - Proper dropdown with all 4 correct options
- 🎯 **COMPLETED**: Converted from readonly input to Select component

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

## ⚠️ **REMAINING ITEMS TO COMPLETE**

1. **🔧 DISCOUNT FIELD**: Add discount field to calculations (partially implemented)
2. **🔧 INTERNAL NOTES**: Add simple internal notes field for PFI  
3. **🔧 SMART DEFAULTS**: Complete localStorage for all field remembering
4. **🔧 REMOVE DEBUG LOGS**: Remove console.log from calculateTotals

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

### Recent Changes - ALL CRITICAL FIXES COMPLETED:
- Fixed duplicate headers ✅
- Fixed calculations showing ₦NaN ✅
- Fixed mobile table width ✅  
- Fixed default bank selection ✅
- Fixed prepared by dropdown ✅
- Fixed approved by dropdown ✅

### Next Priority Actions:
1. **Add discount field to form UI** (currently in calculations but no UI)
2. **Add internal notes field** for PFI management
3. **Complete smart defaults** for all fields
4. **Remove debug console logs** from production code
5. **Final testing** of complete flow

---

**📞 ESCALATION**: If any of these requirements are unclear or conflicting, STOP and ask for clarification rather than guessing. 