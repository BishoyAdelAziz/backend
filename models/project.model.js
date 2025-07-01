// models/project.model.js
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins/index");

const installmentSchema = new mongoose.Schema(
  {
    refNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{8,12}$/, "RefNo must be 8-12 alphanumeric characters"],
    },
    amount: {
      type: Number,
      required: true,
      min: [100, "Minimum installment amount is 100"],
      get: (v) => Math.round(v * 100) / 100, // Store as monetary value
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "credit_card", "check", "cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    currency: {
      // Added currency at installment level
      type: String,
      required: true,
      enum: ["EGP", "USD"],
      default: "EGP",
    },
  },
  { timestamps: true }
);

const projectEmployeeSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["manager", "supervisor", "team_lead", "member"],
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  hourlyRate: {
    type: Number,
    min: 0,
  },
  assignedHours: {
    type: Number,
    min: 0,
  },
});

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    budget: {
      type: Number,
      required: true,
      min: [1000, "Minimum project budget is 1000"],
    },
    currency: {
      type: String,
      default: "EGP",
      enum: ["EGP", "USD"], // Only EGP and USD allowed
    },
    status: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "cancelled"],
      default: "planning",
    },
    employees: [projectEmployeeSchema],
    installments: [installmentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    exchangeRate: {
      // Added for USD conversions
      type: Number,
      min: 0,
      required: function () {
        return this.currency === "USD";
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// Virtual for total payments (converted to project currency)
projectSchema.virtual("totalPayments").get(function () {
  const total = this.installments
    .filter((i) => i.status === "completed")
    .reduce((sum, i) => {
      // Convert to project currency if different
      if (i.currency !== this.currency) {
        if (i.currency === "USD" && this.currency === "EGP") {
          return sum + i.amount * this.exchangeRate;
        } else if (i.currency === "EGP" && this.currency === "USD") {
          return sum + i.amount / this.exchangeRate;
        }
      }
      return sum + i.amount;
    }, 0);

  return parseFloat(total.toFixed(2));
});

// Virtual for payment completion percentage
projectSchema.virtual("paymentCompletion").get(function () {
  if (this.budget <= 0) return 0;
  const percentage = (this.totalPayments / this.budget) * 100;
  return Math.min(100, parseFloat(percentage.toFixed(2)));
});

// Virtual for project progress
projectSchema.virtual("progress").get(function () {
  if (this.status === "completed") return 100;
  if (this.status === "cancelled") return 0;

  if (this.startDate && this.endDate) {
    const totalDays = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (Date.now() - this.startDate) / (1000 * 60 * 60 * 24);
    return Math.min(90, Math.max(0, (daysPassed / totalDays) * 100)).toFixed(2);
  }
  return 0;
});

// Indexes
projectSchema.index({ projectName: "text", description: "text" });
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

// Plugins
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

// Pre-save hook to validate employee departments
projectSchema.pre("save", async function (next) {
  if (this.employees && this.employees.length > 0) {
    const Department = mongoose.model("Department");
    const validDepts = await Department.find({
      _id: { $in: this.employees.map((e) => e.department) },
    });
    if (
      validDepts.length !==
      new Set(this.employees.map((e) => e.department.toString())).size
    ) {
      throw new Error("One or more departments are invalid");
    }
  }

  // Validate exchange rate when currency is USD
  if (
    this.currency === "USD" &&
    (!this.exchangeRate || this.exchangeRate <= 0)
  ) {
    throw new Error("Exchange rate is required for USD projects");
  }

  next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
