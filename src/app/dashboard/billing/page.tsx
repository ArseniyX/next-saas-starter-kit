"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Download, Calendar, Users, Database, Zap, Check, Crown, AlertCircle } from "lucide-react"

// Mock data
const currentPlan = {
  name: "Pro Plan",
  price: 29,
  billing: "monthly",
  nextBilling: "2024-02-15",
  status: "active",
}

const usage = {
  users: { current: 12, limit: 25 },
  storage: { current: 2.4, limit: 10 }, // GB
  apiCalls: { current: 8500, limit: 10000 },
}

const paymentMethod = {
  type: "Visa",
  last4: "4242",
  expiry: "12/26",
}

const invoices = [
  { id: "INV-001", date: "2024-01-15", amount: 29.0, status: "paid" },
  { id: "INV-002", date: "2023-12-15", amount: 29.0, status: "paid" },
  { id: "INV-003", date: "2023-11-15", amount: 29.0, status: "paid" },
  { id: "INV-004", date: "2023-10-15", amount: 29.0, status: "paid" },
  { id: "INV-005", date: "2023-09-15", amount: 19.0, status: "paid" },
]

const plans = [
  {
    name: "Starter",
    price: 19,
    features: ["Up to 10 users", "5GB storage", "5,000 API calls", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: 29,
    features: ["Up to 25 users", "10GB storage", "10,000 API calls", "Priority support", "Advanced analytics"],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    features: [
      "Unlimited users",
      "100GB storage",
      "Unlimited API calls",
      "24/7 phone support",
      "Custom integrations",
      "SLA guarantee",
    ],
    current: false,
  },
]

export default function BillingPage() {
  const [showPlans, setShowPlans] = useState(false)

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, billing, and usage</p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                <p className="text-muted-foreground">
                  ${currentPlan.price}/{currentPlan.billing}
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Next billing: {currentPlan.nextBilling}
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog open={showPlans} onOpenChange={setShowPlans}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Change Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Choose Your Plan</DialogTitle>
                    <DialogDescription>Select the plan that best fits your needs</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 md:grid-cols-3 py-4">
                    {plans.map((plan) => (
                      <Card key={plan.name} className={`relative ${plan.current ? "ring-2 ring-primary" : ""}`}>
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {plan.name}
                            {plan.current && <Badge variant="secondary">Current</Badge>}
                          </CardTitle>
                          <div className="text-3xl font-bold">
                            ${plan.price}
                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full mt-4"
                            variant={plan.current ? "secondary" : "default"}
                            disabled={plan.current}
                          >
                            {plan.current ? "Current Plan" : "Select Plan"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPlans(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Usage Overview
            </CardTitle>
            <CardDescription>Current usage for this billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Users */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </div>
                <span className={getUsageColor(getUsagePercentage(usage.users.current, usage.users.limit))}>
                  {usage.users.current} / {usage.users.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.users.current, usage.users.limit)} />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Storage</span>
                </div>
                <span className={getUsageColor(getUsagePercentage(usage.storage.current, usage.storage.limit))}>
                  {usage.storage.current}GB / {usage.storage.limit}GB
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.storage.current, usage.storage.limit)} />
            </div>

            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>API Calls</span>
                </div>
                <span className={getUsageColor(getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit))}>
                  {usage.apiCalls.current.toLocaleString()} / {usage.apiCalls.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit)} />
            </div>

            {getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit) > 80 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  You're approaching your API limit. Consider upgrading your plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method & Billing History */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </CardTitle>
            <CardDescription>Your default payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• {paymentMethod.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires {paymentMethod.expiry}</p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                Update Payment Method
              </Button>
              <Button variant="outline">Add Card</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common billing tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Latest Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <CreditCard className="h-4 w-4" />
              Update Billing Address
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              View Usage Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="default">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
