import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import ExpenseService from "../../services/ExpenseService";
import ExpenseStats from "./ExpenseComponents/ExpenseStats";
import ExpenseChart from "./ExpenseComponents/ExpenseChart";
import ExpensesTable from "./ExpenseComponents/ExpenseTable";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  const [editExpense, setEditExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    propertyId: "",
    propertyName: "",
  });

  useEffect(() => {
    const initialize = async () => {
      const profile = await fetchProfile();
      if (profile) {
        await Promise.all([fetchProperties(), fetchExpenses()]);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchExpenses();
    }
  }, [selectedProperty, userProfile]);

  const fetchProfile = async () => {
    try {
      const profile = await ExpenseService.getProfile();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties`
      );
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let expensesData;

      if (userProfile?.accountType === "ADMIN") {
        if (selectedProperty) {
          const response = await ExpenseService.getExpensesByProperty(
            selectedProperty
          );
          expensesData = response.data;
        } else {
          const response = await ExpenseService.getAllExpenses();
          expensesData = response;
        }
      } else {
        const response = await ExpenseService.getExpenses();
        expensesData = response.data;
      }

      if (Array.isArray(expensesData)) {
        setExpenses(expensesData);
        calculateStats(expensesData);
        prepareChartData(expensesData);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setTotalExpenses(total);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthExpenses = data.filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    });
    setCurrentMonthExpenses(
      monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
    );
  };

  const prepareChartData = (data) => {
    const monthlyTotals = data.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});

    setMonthlyData(
      Object.entries(monthlyTotals).map(([month, amount]) => ({
        month,
        amount,
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      const selectedPropertyData = properties.find(
        (p) => p.id === selectedProperty
      );
      const expenseData = {
        ...expenseForm,
        propertyId:
          userProfile.accountType === "ADMIN"
            ? selectedProperty
            : userProfile.propertyId,
        propertyName: selectedPropertyData?.name || userProfile.propertyName,
        userId: userProfile.id,
        date: new Date().toISOString(),
      };

      if (editExpense) {
        await ExpenseService.updateExpense(editExpense.id, expenseData);
        setEditExpense(null);
      } else {
        await ExpenseService.createExpense(expenseData);
      }

      await fetchExpenses();
      setShowAddExpense(false);
      resetExpenseForm();
    } catch (error) {
      console.error("Error adding or editing expense:", error);
    }
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      description: "",
      amount: "",
      category: "",
      propertyId: "",
      propertyName: "",
    });
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      propertyId: expense.propertyId,
      propertyName: expense.propertyName,
    });
    setShowAddExpense(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {userProfile?.accountType === "ADMIN" && (
            <>
              <Select
                label="All Properties"
                options={[{ label: "All Properties", value: "" }].concat(
                  properties.map((property) => ({
                    label: property.name,
                    value: property.id,
                  }))
                )}
                value={selectedProperty}
                onChange={(value) => {
                  setSelectedProperty(value);
                  fetchExpenses();
                }}
              />
            </>
          )}
        </div>
        <Button onClick={() => setShowAddExpense(true)}>
          <Plus className="w-4 h-4" />
          {editExpense ? "Edit Expense" : "Add Expense"}
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ExpenseStats
            totalExpenses={totalExpenses}
            currentMonthExpenses={currentMonthExpenses}
            monthlyData={monthlyData}
          />
          <ExpenseChart monthlyData={monthlyData} />
          <ExpensesTable
            expenses={expenses}
            onDelete={async (id) => {
              try {
                await ExpenseService.deleteExpense(id);
                await fetchExpenses();
              } catch (error) {
                console.error("Error deleting expense:", error);
              }
            }}
            onEdit={handleEdit}
          />
        </>
      )}

      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="bg-white p-6 rounded-lg border max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-700">
              {editExpense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {userProfile?.accountType === "ADMIN" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Property
                </label>
                <Select
                  options={properties.map((property) => ({
                    label: property.name,
                    value: property.id,
                  }))}
                  value={expenseForm.propertyId}
                  onChange={(value) =>
                    setExpenseForm({
                      ...expenseForm,
                      propertyId: value,
                    })
                  }
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <Input
                  placeholder="Enter description"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <Input
                placeholder="Enter category"
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    category: e.target.value,
                  })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddExpense(false);
                  resetExpenseForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editExpense ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseDashboard;
