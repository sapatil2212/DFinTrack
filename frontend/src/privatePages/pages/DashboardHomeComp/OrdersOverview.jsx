import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersOverview({ orders, monthlyChange }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            Orders Overview
          </CardTitle>
          <p className="text-sm text-green-500">+{monthlyChange}% this month</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="flex items-start space-x-4">
              <div className="mt-1">{order.icon}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.amount && (
                    <span className="font-bold">${order.amount} </span>
                  )}
                  {order.title}
                </p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
