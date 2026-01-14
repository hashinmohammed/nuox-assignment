import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pagination helper
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1,
    },
  };
};

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  const files = [
    "shareholders.json",
    "shares.json",
    "installments.json",
    "payments.json",
  ];

  files.forEach((file) => {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  });
};

initializeDataFiles();

// Read data from a JSON file
const readData = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Write data to a JSON file
const writeData = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

// Generic CRUD operations
export const db = {
  shareholders: {
    getAll: (page = null, limit = 10, filters = {}) => {
      let data = readData("shareholders.json");

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        data = data.filter(
          (s) =>
            s.name.toLowerCase().includes(searchTerm) ||
            s.email.toLowerCase().includes(searchTerm)
        );
      }

      // Apply Country Filter
      if (filters.country) {
        data = data.filter((s) => s.country === filters.country);
      }

      // Sort by createdAt descending (newest first)
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (page) {
        return paginate(data, page, limit);
      }
      return data;
    },
    getById: (id) => {
      const shareholders = readData("shareholders.json");
      return shareholders.find((s) => s.id === id);
    },
    getByEmail: (email) => {
      const shareholders = readData("shareholders.json");
      return shareholders.filter((s) =>
        s.email.toLowerCase().includes(email.toLowerCase())
      );
    },
    create: (data) => {
      const shareholders = readData("shareholders.json");
      const newShareholder = {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      shareholders.push(newShareholder);
      writeData("shareholders.json", shareholders);
      return newShareholder;
    },
    update: (id, data) => {
      const shareholders = readData("shareholders.json");
      const index = shareholders.findIndex((s) => s.id === id);
      if (index === -1) return null;

      shareholders[index] = {
        ...shareholders[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      writeData("shareholders.json", shareholders);
      return shareholders[index];
    },
    delete: (id) => {
      const shareholders = readData("shareholders.json");
      const filtered = shareholders.filter((s) => s.id !== id);
      writeData("shareholders.json", filtered);
      return filtered.length < shareholders.length;
    },
  },

  // Shares
  shares: {
    getAll: (page = null, limit = 10) => {
      const data = readData("shares.json");
      if (page) {
        return paginate(data, page, limit);
      }
      return data;
    },
    getById: (id) => {
      const shares = readData("shares.json");
      return shares.find((s) => s.id === id);
    },
    getByShareholderId: (shareholderId) => {
      const shares = readData("shares.json");
      return shares.filter((s) => s.shareholderId === shareholderId);
    },
    create: (data) => {
      const shares = readData("shares.json");
      const newShare = {
        id: uuidv4(),
        ...data,
        totalAmount: data.annualAmount * data.duration,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      shares.push(newShare);
      writeData("shares.json", shares);
      return newShare;
    },
    update: (id, data) => {
      const shares = readData("shares.json");
      const index = shares.findIndex((s) => s.id === id);
      if (index === -1) return null;

      shares[index] = {
        ...shares[index],
        ...data,
        totalAmount:
          (data.annualAmount || shares[index].annualAmount) *
          (data.duration || shares[index].duration),
        updatedAt: new Date().toISOString(),
      };
      writeData("shares.json", shares);
      return shares[index];
    },
    delete: (id) => {
      const shares = readData("shares.json");
      const filtered = shares.filter((s) => s.id !== id);
      writeData("shares.json", filtered);
      return filtered.length < shares.length;
    },
  },

  // Installments
  installments: {
    getAll: (page = null, limit = 10) => {
      const data = readData("installments.json");
      if (page) {
        return paginate(data, page, limit);
      }
      return data;
    },
    getById: (id) => {
      const installments = readData("installments.json");
      return installments.find((i) => i.id === id);
    },
    getByShareId: (shareId) => {
      const installments = readData("installments.json");
      return installments.filter((i) => i.shareId === shareId);
    },
    create: (data) => {
      const installments = readData("installments.json");
      const newInstallment = {
        id: uuidv4(),
        ...data,
        status: data.status || "pending",
        paidAmount: data.paidAmount || 0,
        balanceAmount: data.installmentAmount - (data.paidAmount || 0),
        createdAt: new Date().toISOString(),
      };
      installments.push(newInstallment);
      writeData("installments.json", installments);
      return newInstallment;
    },
    createBulk: (dataArray) => {
      const installments = readData("installments.json");
      const newInstallments = dataArray.map((data) => ({
        id: uuidv4(),
        ...data,
        status: data.status || "pending",
        paidAmount: data.paidAmount || 0,
        balanceAmount: data.installmentAmount - (data.paidAmount || 0),
        createdAt: new Date().toISOString(),
      }));
      installments.push(...newInstallments);
      writeData("installments.json", installments);
      return newInstallments;
    },
    update: (id, data) => {
      const installments = readData("installments.json");
      const index = installments.findIndex((i) => i.id === id);
      if (index === -1) return null;

      const updatedInstallment = {
        ...installments[index],
        ...data,
      };

      // Recalculate balance and status
      updatedInstallment.balanceAmount =
        updatedInstallment.installmentAmount - updatedInstallment.paidAmount;

      if (updatedInstallment.paidAmount === 0) {
        updatedInstallment.status = "pending";
      } else if (
        updatedInstallment.paidAmount >= updatedInstallment.installmentAmount
      ) {
        updatedInstallment.status = "paid";
      } else {
        updatedInstallment.status = "partial";
      }

      installments[index] = updatedInstallment;
      writeData("installments.json", installments);
      return installments[index];
    },
    delete: (id) => {
      const installments = readData("installments.json");
      const filtered = installments.filter((i) => i.id !== id);
      writeData("installments.json", filtered);
      return filtered.length < installments.length;
    },
    deleteByShareId: (shareId) => {
      const installments = readData("installments.json");
      const filtered = installments.filter((i) => i.shareId !== shareId);
      writeData("installments.json", filtered);
      return filtered.length < installments.length;
    },
  },

  // Payments
  payments: {
    getAll: () => readData("payments.json"),
    getById: (id) => {
      const payments = readData("payments.json");
      return payments.find((p) => p.id === id);
    },
    getByInstallmentId: (installmentId) => {
      const payments = readData("payments.json");
      return payments.filter((p) => p.installmentId === installmentId);
    },
    create: (data) => {
      const payments = readData("payments.json");
      const newPayment = {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      payments.push(newPayment);
      writeData("payments.json", payments);
      return newPayment;
    },
    delete: (id) => {
      const payments = readData("payments.json");
      const filtered = payments.filter((p) => p.id !== id);
      writeData("payments.json", filtered);
      return filtered.length < payments.length;
    },
  },
};
