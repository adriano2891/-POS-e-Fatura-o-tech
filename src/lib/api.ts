import {
  CompanyInfo,
  CertifiedBillingConfig,
  Product,
  Category,
  Customer,
  CashShift,
  Sale,
  FiscalDocument,
  IntegrationLog,
  AuditLog,
  User,
} from '../types';

export const api = {
  // Status
  async getStatus() {
    const res = await fetch('/api/status');
    return res.json();
  },

  // Company
  async getCompany(): Promise<CompanyInfo> {
    const res = await fetch('/api/company');
    return res.json();
  },
  async updateCompany(data: Partial<CompanyInfo> & { operatorName?: string }): Promise<{ success: boolean; company: CompanyInfo }> {
    const res = await fetch('/api/company', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Certified Billing
  async getCertifiedBilling(): Promise<CertifiedBillingConfig> {
    const res = await fetch('/api/certified-billing');
    return res.json();
  },
  async updateCertifiedBilling(data: Partial<CertifiedBillingConfig> & { operatorName?: string }) {
    const res = await fetch('/api/certified-billing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async testCertifiedBilling(operatorName?: string) {
    const res = await fetch('/api/certified-billing/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName }),
    });
    return res.json();
  },
  async getIntegrationLogs(): Promise<IntegrationLog[]> {
    const res = await fetch('/api/invoicing/logs');
    return res.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    return res.json();
  },
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    return res.json();
  },
  async createProduct(data: Partial<Product> & { operatorName?: string }) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateProduct(id: string, data: Partial<Product> & { operatorName?: string; priceChangeReason?: string }) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async validateAccountant(id: string, accountantName: string) {
    const res = await fetch(`/api/products/${id}/validate-accountant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountantName }),
    });
    return res.json();
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch('/api/customers');
    return res.json();
  },
  async saveCustomer(data: Partial<Customer> & { operatorName?: string }) {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async anonymizeCustomer(id: string, operatorName?: string) {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName }),
    });
    return res.json();
  },

  // Shifts / Cash
  async getCurrentShift(): Promise<CashShift | null> {
    const res = await fetch('/api/shifts/current');
    return res.json();
  },
  async getShifts(): Promise<CashShift[]> {
    const res = await fetch('/api/shifts');
    return res.json();
  },
  async openShift(openingAmount: number, operatorName?: string) {
    const res = await fetch('/api/shifts/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openingAmount, operatorName }),
    });
    return res.json();
  },
  async addShiftMovement(type: 'entrada' | 'saida' | 'sangria', amount: number, reason: string, operatorName?: string) {
    const res = await fetch('/api/shifts/movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount, reason, operatorName }),
    });
    return res.json();
  },
  async closeShift(countedCash: number, closingNotes?: string, operatorName?: string) {
    const res = await fetch('/api/shifts/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countedCash, closingNotes, operatorName }),
    });
    return res.json();
  },

  // Sales
  async createSale(saleData: any) {
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData),
    });
    return res.json();
  },
  async getSales(filters?: {
    startDate?: string;
    endDate?: string;
    nif?: string;
    fiscalStatus?: string;
    paymentMethod?: string;
    saleType?: string;
  }): Promise<Sale[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });
    }
    const res = await fetch(`/api/sales?${params.toString()}`);
    return res.json();
  },
  async getSale(id: string): Promise<Sale> {
    const res = await fetch(`/api/sales/${id}`);
    return res.json();
  },

  // Invoicing & Documents
  async getFiscalDocuments(): Promise<FiscalDocument[]> {
    const res = await fetch('/api/invoicing/documents');
    return res.json();
  },
  async getFiscalDocument(id: string): Promise<FiscalDocument> {
    const res = await fetch(`/api/invoicing/documents/${id}`);
    return res.json();
  },
  async retryFiscalEmission(saleId: string, documentType = 'FS', operatorName?: string) {
    const res = await fetch(`/api/invoicing/retry/${saleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentType, operatorName }),
    });
    return res.json();
  },
  async emitCreditNote(originalDocumentId: string, reason: string, operatorName?: string) {
    const res = await fetch('/api/invoicing/credit-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalDocumentId, reason, operatorName }),
    });
    return res.json();
  },
  async recordPrintDocument(id: string, operatorName?: string) {
    const res = await fetch(`/api/invoicing/documents/${id}/print`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorName }),
    });
    return res.json();
  },
  async emailDocument(id: string, recipientEmail: string, operatorName?: string) {
    const res = await fetch(`/api/invoicing/documents/${id}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, operatorName }),
    });
    return res.json();
  },
  async whatsappDocument(id: string, recipientPhone: string, operatorName?: string) {
    const res = await fetch(`/api/invoicing/documents/${id}/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientPhone, operatorName }),
    });
    return res.json();
  },

  // Reports & Dashboard
  async getDashboardReport() {
    const res = await fetch('/api/reports/dashboard');
    return res.json();
  },
  async getDetailedReport(period: 'today' | 'week' | 'month' = 'today') {
    const res = await fetch(`/api/reports/detailed?period=${period}`);
    return res.json();
  },

  // Users & Audits
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    return res.json();
  },
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },
};
