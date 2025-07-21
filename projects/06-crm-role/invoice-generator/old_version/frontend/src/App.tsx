import React, { useState, useRef } from 'react';
import { Plus, Trash2, FileText, Printer } from 'lucide-react';

interface LineItem {
  id: number;
  brand: string;
  model: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Vehicle {
  brand: string;
  model: string;
  description: string;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  validUntil: string;
  invoiceType: 'standard' | 'government' | 'usd';
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  customerContact: string;
  salesExecutive: string;
  contactNumber: string;
  lineItems: LineItem[];
  transportCost: number;
  registrationCost: number;
  showTransport: boolean;
  showRegistration: boolean;
}

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number) => string;
  numberToWords: (num: number) => string;
  calculateSubtotal: () => number;
  calculateVAT: () => number;
  calculateTotal: () => number;
}

const InvoiceGenerator: React.FC = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'customer' | 'vehicles' | 'preview'>('customer');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}01`,
    invoiceDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceType: 'standard',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    customerContact: '',
    salesExecutive: 'MGMT',
    contactNumber: '08098895454',
    lineItems: [{
      id: 1,
      brand: '',
      model: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }],
    transportCost: 0,
    registrationCost: 100000,
    showTransport: false,
    showRegistration: true
  });

  const vehicleCatalog: Vehicle[] = [
    { brand: 'CHANGAN', model: 'ALSVIN V3 DYNAMIC', description: 'CHANGAN ALSVIN V3 DYNAMIC SEDAN', price: 28990000 },
    { brand: 'CHANGAN', model: 'CS15 DYNAMIC', description: 'CHANGAN CS15 DYNAMIC SUV', price: 32990000 },
    { brand: 'CHANGAN', model: 'EADO PLUS EXECUTIVE', description: 'CHANGAN EADO PLUS EXECUTIVE SEDAN', price: 46990000 },
    { brand: 'CHANGAN', model: 'EADO PLUS LUXURY', description: 'CHANGAN EADO PLUS LUXURY SEDAN', price: 52990000 },
    { brand: 'CHANGAN', model: 'CS35 PLUS LUXURY', description: 'CHANGAN CS35 PLUS LUXURY SUV', price: 42990000 },
    { brand: 'CHANGAN', model: 'CS35 PLUS LUXURY PRO', description: 'CHANGAN CS35 PLUS LUXURY PRO SUV', price: 50990000 },
    { brand: 'CHANGAN', model: 'CS55PLUS LUXURY', description: 'CHANGAN CS55PLUS LUXURY SUV', price: 52990000 },
    { brand: 'CHANGAN', model: 'CS55PLUS LUXURY PRO', description: 'CHANGAN CS55PLUS LUXURY PRO SUV', price: 59990000 },
    { brand: 'CHANGAN', model: 'CS95 PLUS ROYALE', description: 'CHANGAN CS95 PLUS ROYALE SUV', price: 81990000 },
    { brand: 'CHANGAN', model: 'UNI-T SVP', description: 'CHANGAN UNI-T SVP SUV', price: 66990000 },
    { brand: 'CHANGAN', model: 'UNI-K BESPOKE', description: 'CHANGAN UNI-K BESPOKE SUV', price: 103990000 },
    { brand: 'CHANGAN', model: 'X7 PLUS LUXURY PRO', description: 'CHANGAN X7 PLUS LUXURY PRO SUV', price: 49990000 },
    { brand: 'MAXUS', model: 'T60 ELITE', description: 'MAXUS T60 ELITE PICKUP', price: 43990000 },
    { brand: 'MAXUS', model: 'T60 COMFORT 4X2', description: 'MAXUS T60 COMFORT 4X2 DOUBLE CABIN PICKUP', price: 37990000 },
    { brand: 'MAXUS', model: 'T60 COMFORT 4X4', description: 'MAXUS T60 COMFORT 4X4 DOUBLE CABIN PICKUP', price: 42990000 },
    { brand: 'MAXUS', model: 'T60 LUXURY', description: 'MAXUS T60 LUXURY PICKUP', price: 61990000 },
    { brand: 'MAXUS', model: 'D90 MAX EXECUTIVE', description: 'MAXUS D90 MAX EXECUTIVE SUV', price: 80990000 },
    { brand: 'MAXUS', model: 'D90 MAX EXECUTIVE PRO', description: 'MAXUS D90 MAX EXECUTIVE PRO SUV', price: 89990000 }
  ];

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newItems = [...invoiceData.lineItems];
    (newItems[index] as any)[field] = value;
    if (field === 'model') {
      const vehicle = vehicleCatalog.find(v => v.model === value);
      if (vehicle) {
        newItems[index].brand = vehicle.brand;
        newItems[index].description = vehicle.description;
        newItems[index].unitPrice = vehicle.price;
        newItems[index].total = vehicle.price * newItems[index].quantity;
      }
    } else if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setInvoiceData({ ...invoiceData, lineItems: newItems });
  };

  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, {
        id: Date.now(),
        brand: '',
        model: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }]
    });
  };

  const removeLineItem = (index: number) => {
    if (invoiceData.lineItems.length > 1) {
      const newItems = invoiceData.lineItems.filter((_, i) => i !== index);
      setInvoiceData({ ...invoiceData, lineItems: newItems });
    }
  };

  const calculateSubtotal = () => {
    const itemsTotal = invoiceData.lineItems.reduce((sum, item) => sum + item.total, 0);
    const transportCost = invoiceData.showTransport ? parseFloat(invoiceData.transportCost.toString()) || 0 : 0;
    const vehicleCount = invoiceData.lineItems.filter(item => item.description).length;
    const registrationTotal = invoiceData.showRegistration ? (parseFloat(invoiceData.registrationCost.toString()) || 0) * vehicleCount : 0;
    return itemsTotal + transportCost + registrationTotal;
  };

  const calculateVAT = () => {
    if (invoiceData.invoiceType === 'government') return 0;
    return calculateSubtotal() * 0.075;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const formatCurrency = (amount: number) => {
    const currency = invoiceData.invoiceType === 'usd' ? '$' : '₦';
    return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const numberToWords = (num: number) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    if (num === 0) return 'zero';
    const convert = (n: number): string => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      return convert(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
    };
    const words = convert(Math.floor(num));
    const currencyName = invoiceData.invoiceType === 'usd' ? 'dollars' : 'naira';
    return words.charAt(0).toUpperCase() + words.slice(1) + ' ' + currencyName + ' only';
  };

  const handlePrint = () => {
    window.print();
  };

  const groupedVehicles = vehicleCatalog.reduce((acc: Record<string, Vehicle[]>, vehicle) => {
    if (!acc[vehicle.brand]) acc[vehicle.brand] = [];
    acc[vehicle.brand].push(vehicle);
    return acc;
  }, {});

  const isFormValid = () => {
    return invoiceData.customerName && invoiceData.customerAddress && invoiceData.customerPhone && invoiceData.lineItems.some(item => item.description);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-red-600 text-white p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={24} />
              Mikano Invoice Generator
            </h1>
          </div>
          <div className="flex border-b">
            <button onClick={() => setActiveTab('customer')} className={`flex-1 py-3 px-4 font-semibold ${activeTab === 'customer' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}>
              Customer Info
            </button>
            <button onClick={() => setActiveTab('vehicles')} className={`flex-1 py-3 px-4 font-semibold ${activeTab === 'vehicles' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}>
              Vehicles
            </button>
            <button onClick={() => setActiveTab('preview')} className={`flex-1 py-3 px-4 font-semibold ${activeTab === 'preview' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600'}`}>
              Preview
            </button>
          </div>
          <div className="p-4">
            {activeTab === 'customer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Type</label>
                    <select value={invoiceData.invoiceType} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceType: e.target.value as 'standard' | 'government' | 'usd' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
                      <option value="standard">Standard (NGN + VAT)</option>
                      <option value="government">Government (NGN, No VAT)</option>
                      <option value="usd">USD Invoice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input type="text" value={invoiceData.invoiceNumber} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input type="date" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input type="date" value={invoiceData.validUntil} onChange={(e) => setInvoiceData({ ...invoiceData, validUntil: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                      <input type="text" value={invoiceData.customerName} onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Enter customer name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                      <input type="text" value={invoiceData.customerContact} onChange={(e) => setInvoiceData({ ...invoiceData, customerContact: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Contact person name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="text" value={invoiceData.customerPhone} onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="+234-XXX-XXX-XXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" value={invoiceData.customerEmail} onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="customer@example.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <textarea value={invoiceData.customerAddress} onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" rows={2} placeholder="Enter full address" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setActiveTab('vehicles')} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    Next: Add Vehicles
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'vehicles' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Selection</h3>
                <div className="space-y-2">
                  {invoiceData.lineItems.map((item, index) => (
                    <div key={item.id} className="border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                          <select value={item.model} onChange={(e) => updateLineItem(index, 'model', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
                            <option value="">Select Vehicle</option>
                            {Object.entries(groupedVehicles).map(([brand, vehicles]) => (
                              <optgroup key={brand} label={brand}>
                                {vehicles.map((vehicle) => (
                                  <option key={vehicle.model} value={vehicle.model}>
                                    {vehicle.model}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input type="number" value={item.quantity} onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" min="1" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                          <input type="text" value={formatCurrency(item.unitPrice)} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
                        </div>
                        <div className="md:col-span-1">
                          <button onClick={() => removeLineItem(index)} className="w-full px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md" disabled={invoiceData.lineItems.length === 1}>
                            <Trash2 size={18} className="mx-auto" />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <div className="mt-2 text-sm text-gray-600">
                          {item.description} - Total: {formatCurrency(item.total)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addLineItem} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  <Plus size={18} />
                  Add Another Vehicle
                </button>
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold">Additional Costs</h4>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={invoiceData.showTransport} onChange={(e) => setInvoiceData({ ...invoiceData, showTransport: e.target.checked })} className="rounded text-red-600" />
                    <span>Add Transportation Cost</span>
                    {invoiceData.showTransport && (
                      <input type="number" value={invoiceData.transportCost} onChange={(e) => setInvoiceData({ ...invoiceData, transportCost: parseFloat(e.target.value) || 0 })} className="ml-auto px-3 py-1 border border-gray-300 rounded" placeholder="Amount" />
                    )}
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={invoiceData.showRegistration} onChange={(e) => setInvoiceData({ ...invoiceData, showRegistration: e.target.checked })} className="rounded text-red-600" />
                    <span>Add Registration Cost (₦{invoiceData.registrationCost.toLocaleString()} per vehicle)</span>
                    {invoiceData.showRegistration && (
                      <input type="number" value={invoiceData.registrationCost} onChange={(e) => setInvoiceData({ ...invoiceData, registrationCost: parseFloat(e.target.value) || 0 })} className="ml-auto px-3 py-1 border border-gray-300 rounded" placeholder="Amount per vehicle" />
                    )}
                  </label>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setActiveTab('customer')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Back
                  </button>
                  <button onClick={() => setActiveTab('preview')} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" disabled={!isFormValid()}>
                    Preview Invoice
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'preview' && (
              <div>
                {!isFormValid() ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Please fill in all required fields before previewing.</p>
                    <button onClick={() => setActiveTab('customer')} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Go Back
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex justify-between">
                      <button onClick={() => setActiveTab('vehicles')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        Back to Edit
                      </button>
                      <button onClick={handlePrint} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                        <Printer size={20} />
                        Print / Save PDF
                      </button>
                    </div>
                    <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142.86%' }}>
                        <InvoicePreview invoiceData={invoiceData} formatCurrency={formatCurrency} numberToWords={numberToWords} calculateSubtotal={calculateSubtotal} calculateVAT={calculateVAT} calculateTotal={calculateTotal} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden">
        <InvoicePreview invoiceData={invoiceData} formatCurrency={formatCurrency} numberToWords={numberToWords} calculateSubtotal={calculateSubtotal} calculateVAT={calculateVAT} calculateTotal={calculateTotal} />
      </div>
    </div>
  );
};

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  formatCurrency: (amount: number) => string;
  numberToWords: (num: number) => string;
  calculateSubtotal: () => number;
  calculateVAT: () => number;
  calculateTotal: () => number;
}
const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, formatCurrency, numberToWords, calculateSubtotal, calculateVAT, calculateTotal }) => {
  const validItems = invoiceData.lineItems.filter(item => item.description);
  return (
    <div id="invoice-print" style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white', position: 'relative' }}>
      <div style={{ padding: '10mm 15mm 30mm 15mm' }}>
        <div style={{ backgroundColor: '#dc2626', color: 'white', margin: '-10mm -15mm 0 -15mm', padding: '15mm 15mm 10mm 15mm', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 5mm 0' }}>
            MIKANO INTERNATIONAL LIMITED
          </h1>
          <p style={{ fontSize: '10pt', margin: '0 0 2mm 0' }}>
            65 Adeola Odeku Street, Victoria Island, Lagos
          </p>
          <p style={{ fontSize: '10pt', margin: 0 }}>
            ☎ 0800 765 43 21
          </p>
        </div>
        <h2 style={{ fontSize: '18pt', fontWeight: 'bold', color: '#dc2626', textAlign: 'center', margin: '10mm 0' }}>
          PRO-FORMA INVOICE
        </h2>
        <div style={{ display: 'flex', gap: '10mm', marginBottom: '10mm' }}>
          <div style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '5mm' }}>
            <div style={{ backgroundColor: '#dc2626', color: 'white', margin: '-5mm -5mm 5mm -5mm', padding: '3mm 5mm', fontWeight: 'bold', fontSize: '10pt' }}>
              INVOICE DETAILS
            </div>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Invoice No:</strong> {invoiceData.invoiceNumber}
            </p>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Date:</strong> {new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')}
            </p>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Valid Until:</strong> {new Date(invoiceData.validUntil).toLocaleDateString('en-GB')}
            </p>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Sales Executive:</strong> {invoiceData.salesExecutive}
            </p>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Contact No:</strong> {invoiceData.contactNumber}
            </p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '5mm' }}>
            <div style={{ backgroundColor: '#dc2626', color: 'white', margin: '-5mm -5mm 5mm -5mm', padding: '3mm 5mm', fontWeight: 'bold', fontSize: '10pt' }}>
              CUSTOMER INFORMATION
            </div>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Name:</strong> {invoiceData.customerName}
            </p>
            {invoiceData.customerContact && (
              <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
                <strong>Contact:</strong> {invoiceData.customerContact}
              </p>
            )}
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Address:</strong> {invoiceData.customerAddress}
            </p>
            <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
              <strong>Phone:</strong> {invoiceData.customerPhone}
            </p>
            {invoiceData.customerEmail && (
              <p style={{ margin: '2mm 0', fontSize: '10pt' }}>
                <strong>Email:</strong> {invoiceData.customerEmail}
              </p>
            )}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10mm' }}>
          <thead>
            <tr style={{ backgroundColor: '#dc2626', color: 'white' }}>
              <th style={{ padding: '3mm 5mm', textAlign: 'left', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #dc2626' }}>
                Brand
              </th>
              <th style={{ padding: '3mm 5mm', textAlign: 'left', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #dc2626' }}>
                Model
              </th>
              <th style={{ padding: '3mm 5mm', textAlign: 'center', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #dc2626' }}>
                QTY
              </th>
              <th style={{ padding: '3mm 5mm', textAlign: 'right', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #dc2626' }}>
                UNIT PRICE
              </th>
              <th style={{ padding: '3mm 5mm', textAlign: 'right', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #dc2626' }}>
                AMOUNT ({invoiceData.invoiceType === 'usd' ? '=$' : '=₦='})
              </th>
            </tr>
          </thead>
          <tbody>
            {validItems.map((item, index) => (
              <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                <td style={{ padding: '3mm 5mm', fontSize: '10pt', border: '1px solid #e5e7eb' }}>{item.brand}</td>
                <td style={{ padding: '3mm 5mm', fontSize: '10pt', border: '1px solid #e5e7eb' }}>{item.model}</td>
                <td style={{ padding: '3mm 5mm', textAlign: 'center', fontSize: '10pt', border: '1px solid #e5e7eb' }}>{item.quantity}</td>
                <td style={{ padding: '3mm 5mm', textAlign: 'right', fontSize: '10pt', border: '1px solid #e5e7eb' }}>
                  {formatCurrency(item.unitPrice)}
                </td>
                <td style={{ padding: '3mm 5mm', textAlign: 'right', fontSize: '10pt', fontWeight: 'bold', border: '1px solid #e5e7eb' }}>
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '9pt', marginBottom: '10mm', fontStyle: 'italic' }}>
          Note: Proforma invoice is valid for 24 hours from date of issue.
        </p>
        <div style={{ marginLeft: 'auto', width: '80mm', marginBottom: '10mm' }}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '5mm', border: '1px solid #e5e7eb' }}>
            {invoiceData.showTransport && invoiceData.transportCost > 0 && (
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0', fontSize: '10pt' }}>
                <span>Transportation:</span>
                <span>{formatCurrency(invoiceData.transportCost)}</span>
              </p>
            )}
            {invoiceData.showRegistration && (
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0', fontSize: '10pt' }}>
                <span>Registration ({validItems.length} vehicles):</span>
                <span>{formatCurrency(invoiceData.registrationCost * validItems.length)}</span>
              </p>
            )}
            <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0', fontSize: '10pt' }}>
              <span>AMOUNT IN WORDS:</span>
            </p>
            <p style={{ fontSize: '9pt', color: '#6b7280', margin: '2mm 0' }}>
              {numberToWords(calculateTotal())}
            </p>
            {invoiceData.invoiceType !== 'government' && (
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0', fontSize: '10pt' }}>
                <span>7.5% VAT</span>
                <span>{formatCurrency(calculateVAT())}</span>
              </p>
            )}
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12pt', fontWeight: 'bold', color: '#dc2626', borderTop: '1px solid #d1d5db', paddingTop: '3mm', marginTop: '3mm' }}>
              <span>TOTAL</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </p>
          </div>
        </div>
        <div style={{ fontSize: '9pt', marginBottom: '10mm' }}>
          <p style={{ margin: '2mm 0' }}><strong>Kindly pay into:</strong></p>
          <p style={{ margin: '2mm 0' }}>Account Name: MIKANO INTERNATIONAL LTD (MOTORS)</p>
          <p style={{ margin: '2mm 0' }}>Account No: 1450866387</p>
          <p style={{ margin: '2mm 0' }}>Bank Name: ACCESS BANK PLC</p>
        </div>
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', padding: '5mm', marginBottom: '10mm', fontSize: '9pt' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 2mm 0' }}>
            ⚠️ IMPORTANT ! WARRANTY & AFTERSALES INFORMATION
          </p>
          <p style={{ margin: '1mm 0' }}>CHANGAN: 6 YEARS / 200,000KM WHICHEVER COMES FIRST</p>
          <p style={{ margin: '1mm 0' }}>GEELY: 5 YEARS / 150,000KM WHICHEVER COMES FIRST</p>
          <p style={{ margin: '1mm 0' }}>MAXUS: 5 YEARS / 130,000KM WHICHEVER COMES FIRST</p>
          <p style={{ margin: '1mm 0' }}>Additional Information may be required to activate warranty.</p>
          <p style={{ margin: '1mm 0' }}>Contact No. 07015286045</p>
          <p style={{ margin: '1mm 0' }}>Courtesy VIP service & 24/7 Roadside Assistance</p>
        </div>
        <div style={{ fontSize: '8pt', color: '#6b7280' }}>
          <p style={{ fontWeight: 'bold', margin: '2mm 0' }}>Payment & Delivery Terms</p>
          <p style={{ margin: '1mm 0' }}>-100% Payment in advance</p>
          <p style={{ margin: '1mm 0' }}>-Vehicle Registration fee: 100,000NGN per unit</p>
          <p style={{ margin: '1mm 0' }}>-Vehicle pick-up at any of Mikano Motors showroom in Lagos is free</p>
          <p style={{ margin: '1mm 0' }}>-Delivery will come at a cost based on Location (Lagos Included)</p>
        </div>
        <div style={{ marginTop: '15mm', display: 'flex', justifyContent: 'space-between', fontSize: '9pt' }}>
          <div>
            <p style={{ margin: '0 0 10mm 0' }}>Prepared By: {invoiceData.salesExecutive}</p>
            <div style={{ borderTop: '1px solid #000', width: '50mm' }}></div>
          </div>
          <div>
            <p style={{ margin: '0 0 10mm 0' }}>Approved By: RALPH. H</p>
            <div style={{ borderTop: '1px solid #000', width: '50mm' }}></div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#f3f4f6', borderTop: '1px solid #e5e7eb', padding: '5mm 15mm', textAlign: 'center', fontSize: '8pt', color: '#6b7280' }}>
        <p style={{ margin: '1mm 0' }}>
          Mikano Motors is on Pioneer Status (Tax Holiday). Withholding Tax (WHT) is Non-Deductible.
        </p>
        <p style={{ margin: '1mm 0' }}>
          This is a computer-generated invoice and requires no signature.
        </p>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
