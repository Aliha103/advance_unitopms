"use client";

const NOTIFICATION_SETTINGS = [
  { group: "Applications", items: [
    { label: "New host application", desc: "When a new host applies to the platform.", email: true, push: true },
    { label: "Application approved", desc: "When an admin approves a host.", email: true, push: false },
    { label: "Application rejected", desc: "When an admin rejects a host.", email: true, push: false },
  ]},
  { group: "Billing", items: [
    { label: "Payment received", desc: "When a subscription payment is processed.", email: true, push: false },
    { label: "Payment failed", desc: "When a payment attempt fails.", email: true, push: true },
    { label: "Invoice overdue", desc: "When an invoice passes its due date.", email: true, push: true },
  ]},
  { group: "System", items: [
    { label: "Service health alerts", desc: "When a system service goes down.", email: true, push: true },
    { label: "Security alerts", desc: "Suspicious activity or fraud detection.", email: true, push: true },
    { label: "Backup status", desc: "Daily database backup results.", email: false, push: false },
  ]},
];

export default function NotificationSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure which notifications you receive and how.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {NOTIFICATION_SETTINGS.map((group) => (
          <div key={group.group} className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">{group.group}</h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-gray-500">
                      <input type="checkbox" defaultChecked={item.email} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      Email
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-500">
                      <input type="checkbox" defaultChecked={item.push} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      Push
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="button" className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
